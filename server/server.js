const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const { Server } = require('socket.io');
const WebSocket = require('ws');
const axios = require('axios');

const MONGODB_URI = process.env.MONGODB_URI;
const FINNHUB_WS = `wss://ws.finnhub.io?token=${process.env.MARKET_API_KEY}`;

const authRoutes = require('./routes/auth');
const marketsRoutes = require('./routes/markets');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => res.send('Backend is working!'));
app.use('/api/auth', authRoutes);
app.use('/api/markets', marketsRoutes);

const httpServer = http.createServer(app);
const io = new Server(httpServer, { cors: { origin: '*' } });

// Track provider subscriptions to avoid duplicate subscribes
const subscribedSymbols = new Set();
let finnhubWs;

// Connect to Finnhub (or other provider websocket)
function connectToProvider() {
  finnhubWs = new WebSocket(FINNHUB_WS);

  finnhubWs.on('open', () => {
    console.log('✅ Connected to Finnhub');
    // re-subscribe symbols if any
    for (const s of subscribedSymbols) {
      finnhubWs.send(JSON.stringify({ type: 'subscribe', symbol: s }));
    }
  });

  finnhubWs.on('message', (msg) => {
    try {
      const parsed = JSON.parse(msg);
      // Finnhub sends messages with type 'trade' containing an array in parsed.data
      if (parsed.type === 'trade' && Array.isArray(parsed.data)) {
        // Forward raw trade updates to clients
        parsed.data.forEach(trade => {
          // emit to rooms by symbol for efficiency
          io.to(trade.s).emit('market:update', trade);
        });
      }
    } catch (err) {
      console.error('Provider message parse error', err);
    }
  });

  finnhubWs.on('close', () => {
    console.log('⚠️ Finnhub connection closed. Reconnecting in 3s.');
    setTimeout(connectToProvider, 3000);
  });

  finnhubWs.on('error', (err) => {
    console.error('Finnhub WS error', err.message);
    finnhubWs.close();
  });
}

// Validate Finnhub API key via a lightweight REST call before opening WS
async function validateFinnhubKey() {
  const key = process.env.MARKET_API_KEY;
  if (!key) {
    console.error('❌ MARKET_API_KEY is not set in server/.env — skipping Finnhub WS connection');
    return false;
  }

  try {
    const res = await axios.get('https://finnhub.io/api/v1/quote', {
      params: { symbol: 'AAPL', token: key },
      timeout: 5000,
    });
    if (res.status === 200) {
      console.log('✅ Finnhub key validated (REST)');
      return true;
    }
  } catch (err) {
    if (err.response && err.response.status === 401) {
      console.error('❌ Finnhub key invalid (401). Check MARKET_API_KEY in server/.env');
    } else {
      console.error('❌ Finnhub validation error:', err.message);
    }
  }
  return false;
}

io.on('connection', (socket) => {
  console.log('Socket connected', socket.id);

  socket.on('subscribe', (symbols = []) => {
    symbols.forEach(sym => {
      socket.join(sym);
      // request provider to subscribe if not already
      if (!subscribedSymbols.has(sym)) {
        subscribedSymbols.add(sym);
        if (finnhubWs && finnhubWs.readyState === WebSocket.OPEN) {
          finnhubWs.send(JSON.stringify({ type: 'subscribe', symbol: sym }));
        }
      }
    });
  });

  socket.on('unsubscribe', (symbols = []) => {
    symbols.forEach(sym => {
      socket.leave(sym);
      // simple unsubscribe logic (optional): track subscribers and send 'unsubscribe' when none left
      // (left as a simple Set here — for production track counts)
      if (subscribedSymbols.has(sym)) {
        // Optionally remove and send unsubscribe to provider:
        // subscribedSymbols.delete(sym);
        // if (finnhubWs && finnhubWs.readyState === WebSocket.OPEN) finnhubWs.send(JSON.stringify({ type: 'unsubscribe', symbol: sym }));
      }
    });
  });

  socket.on('disconnect', () => console.log('Socket disconnected', socket.id));
});

// Connect to DB then start HTTP+Socket.IO server and provider ws
const PORT = process.env.PORT || 5001;
mongoose.connect(MONGODB_URI)
  .then(async () => {
    console.log('✅ Connected to MongoDB');
    httpServer.listen(PORT, () => console.log(`Server listening on ${PORT}`));
    const ok = await validateFinnhubKey();
    if (ok) connectToProvider();
  })
  .catch(err => console.error('❌ MongoDB connection error:', err));