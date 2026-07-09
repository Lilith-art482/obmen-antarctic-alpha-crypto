'use client';
import { motion } from 'framer-motion';
import { usePrices } from '@/hooks/usePrice';
import { FiTrendingUp, FiTrendingDown } from 'react-icons/fi';

const TOP_ASSETS = ['ETH', 'SOL', 'BNB', 'TRX', 'TON'];

export function TopAssets() {
  const { prices } = usePrices();

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-bold text-white">Топ-активов</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {TOP_ASSETS.map((symbol, i) => {
          const p = prices[symbol];
          return (
            <motion.div
              key={symbol}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass p-4 rounded-xl"
            >
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">
                  {symbol === 'ETH' ? '⟠' : symbol === 'SOL' ? '◎' : symbol === 'BNB' ? '◆' : symbol === 'TRX' ? '◈' : '⬡'}
                </span>
                <span className="text-white font-bold">{symbol}/USDT</span>
              </div>
              {p ? (
                <>
                  <p className="text-xl text-white font-bold">${p.price.toFixed(2)}</p>
                  <div className={`flex items-center gap-1 text-sm ${p.change24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {p.change24h >= 0 ? <FiTrendingUp /> : <FiTrendingDown />}
                    <span>{p.change24h >= 0 ? '+' : ''}{p.change24h.toFixed(2)}%</span>
                  </div>
                </>
              ) : (
                <div className="h-12 flex items-center">
                  <div className="w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}