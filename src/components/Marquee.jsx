import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

const TickerItem = ({ symbol, price, change, isPositive }) => (
  <div className="flex items-center space-x-3 mx-8 whitespace-nowrap">
    <span className="font-semibold text-slate-200">{symbol}</span>
    <span className="text-slate-300 font-mono">₹{price}</span>
    <div className={`flex items-center text-sm font-medium ${isPositive ? 'text-primary' : 'text-red-500'}`}>
      {isPositive ? <ArrowUpRight className="w-4 h-4 mr-1" /> : <ArrowDownRight className="w-4 h-4 mr-1" />}
      {change}%
    </div>
  </div>
);

const Marquee = () => {
  const data = [
    { symbol: 'NIFTY 50', price: '22,419.95', change: '0.65', isPositive: true },
    { symbol: 'SENSEX', price: '73,961.31', change: '0.45', isPositive: true },
    { symbol: 'IRFC', price: '142.50', change: '2.40', isPositive: true },
    { symbol: 'RELIANCE', price: '2,955.10', change: '1.20', isPositive: true },
    { symbol: 'HDFCBANK', price: '1,440.00', change: '-0.80', isPositive: false },
    { symbol: 'TCS', price: '3,880.50', change: '0.15', isPositive: true },
  ];

  // Duplicate data to create a seamless loop
  const duplicatedData = [...data, ...data, ...data];

  return (
    <div className="w-full bg-slate-900/50 backdrop-blur-md border-b border-white/5 py-3 overflow-hidden flex">
      <div className="flex animate-marquee min-w-max">
        {duplicatedData.map((item, index) => (
          <TickerItem key={index} {...item} />
        ))}
      </div>
    </div>
  );
};

export default Marquee;
