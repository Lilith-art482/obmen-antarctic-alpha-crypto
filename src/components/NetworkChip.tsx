'use client';
import { motion } from 'framer-motion';

interface Props { active: boolean; onClick: () => void; label: string; }

export function NetworkChip({ active, onClick, label }: Props) {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`text-xs px-3 py-1.5 rounded-full font-medium transition-all ${
        active
          ? 'bg-accent text-white shadow-lg shadow-accent/30'
          : 'bg-white/5 text-gray-400 hover:bg-white/10'
      }`}
    >
      {label}
    </motion.button>
  );
}