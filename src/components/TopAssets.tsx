'use client';
import { motion } from 'framer-motion';
import { usePrices } from '@/hooks/usePrice';
import { SUPPORTED_TOKENS } from '@/types';
import { useTheme, LANG } from '@/hooks/useTheme';
import { FiTrendingUp, FiTrendingDown, FiMinus, FiExternalLink } from 'react-icons/fi';

const ASSETS_TO_SHOW = SUPPORTED_TOKENS.filter(t => t.symbol !== 'USDT' && t.symbol !== 'USDC');

const BINANCE_LINKS: Record<string, string> = {
  ETH: 'https://www.binance.com/en/trade/ETH_USDT',
  SOL: 'https://www.binance.com/en/trade/SOL_USDT',
  GRAM: 'https://www.binance.com/en/trade/GRAM_USDT',
  TRX: 'https://www.binance.com/en/trade/TRX_USDT',
  BNB: 'https://www.binance.com/en/trade/BNB_USDT',
};

export function TopAssets() {
  const { prices } = usePrices();
  const { language } = useTheme();
  const t = LANG[language];

  return (
    <div className="w-full">
      <h3 className="text-lg font-bold text-white mb-4">{t.all_assets}</h3>
      <div className="glass rounded-2xl overflow-hidden">
        <div className="divide-y divide-white/5">
          {ASSETS_TO_SHOW.map((token, i) => {
            const p = prices[token.symbol];
            const binanceUrl = BINANCE_LINKS[token.symbol];
            return (
              <motion.a
                key={token.symbol}
                href={binanceUrl}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center gap-4 px-4 py-4 hover:bg-white/5 transition-colors cursor-pointer group"
              >
                <span className="text-2xl w-8 text-center">{token.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-white font-semibold">{token.symbol}</span>
                    <span className="text-xs text-gray-500 truncate">{token.name}</span>
                  </div>
                </div>
                {p ? (
                  <div className="text-right">
                    <p className="text-white font-medium">${p.price.toFixed(2)}</p>
                    <div className={`flex items-center gap-1 text-xs justify-end ${
                      p.change24h > 0 ? 'text-green-400' : p.change24h < 0 ? 'text-red-400' : 'text-gray-400'
                    }`}>
                      {p.change24h > 0 ? <FiTrendingUp size={12} /> : p.change24h < 0 ? <FiTrendingDown size={12} /> : <FiMinus size={12} />}
                      <span>{p.change24h >= 0 ? '+' : ''}{p.change24h.toFixed(2)}%</span>
                    </div>
                  </div>
                ) : (
                  <div className="w-16 flex justify-center">
                    <div className="w-4 h-4 loader-accent rounded-full animate-spin" />
                  </div>
                )}
                <FiExternalLink size={14} className="text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
              </motion.a>
            );
          })}
        </div>
      </div>
    </div>
  );
}
