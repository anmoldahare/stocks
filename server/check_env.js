const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

function findEnvFile() {
  const candidates = [
    path.join(process.cwd(), '.env'), // when run from project root
    path.join(__dirname, '.env'),     // when run from /server
  ];
  for (const p of candidates) {
    if (fs.existsSync(p)) return p;
  }
  return null;
}

const envPath = findEnvFile();
if (envPath) {
  dotenv.config({ path: envPath });
  console.log('Loaded .env from:', envPath);
} else {
  console.log('No .env found in project root or server folder.');
}

const viteKeys = Object.keys(process.env).filter(k => k.startsWith('VITE_'));
if (viteKeys.length === 0) {
  console.log('No VITE_* vars in environment');
} else {
  console.log('VITE_* vars:');
  viteKeys.forEach(k => console.log(`${k}=${process.env[k]}`));
}

console.log('MARKET_API_KEY present:', !!process.env.MARKET_API_KEY);
if (process.env.MARKET_API_KEY) {
  console.log('MARKET_API_KEY length:', process.env.MARKET_API_KEY.length);
}

console.log('\nRun this from project root: `node server/check_env.js`\nor from server folder: `npm run check-env`');
