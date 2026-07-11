'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronDown } from 'react-icons/fi';
import { SUPPORTED_TOKENS } from '@/types';
import type { TokenInfo } from '@/types';

interface Props { token: TokenInfo; onSelect: (t: TokenInfo) => void; }

export function TokenSelect({ token, onSelect }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 bg-white/10 px-3 py-2 rounded-lg hover:bg-white/15 transition-colors"
      >
        <span className="text-lg">{token.icon}</span>
        <span className="text-white font-medium text-sm">{token.symbol}</span>
        <FiChevronDown className="text-gray-400 text-xs" />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute right-0 top-12 w-44 glass p-2 rounded-xl z-50"
          >
            {SUPPORTED_TOKENS.map(t => (
              <button
                key={t.symbol}
                onClick={() => { onSelect(t); setOpen(false); }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                  token.symbol === t.symbol ? 'bg-accent/30 text-white' : 'text-gray-300 hover:bg-white/10'
                }`}
              >
                <span className="text-lg">{t.icon}</span>
                <div className="text-left">
                  <div className="text-sm font-medium">{t.symbol}</div>
                  <div className="text-xs text-gray-500">{t.name}</div>
                </div>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}