'use client';
import { motion } from 'framer-motion';
import { FiCopy, FiExternalLink } from 'react-icons/fi';
import { NETWORKS } from '@/types';
import type { NetworkType } from '@/types';
import toast from 'react-hot-toast';

interface Props {
  network: NetworkType;
  address: string;
  balances: Record<string, number>;
  onSend: () => void;
  onReceive: () => void;
}

export function WalletTile({ network, address, balances, onSend, onReceive }: Props) {
  const net = NETWORKS[network];
  const nativeBalance = balances[network] || 0;
  const usdtBalance = balances[`${network}_usdt`] || 0;
  const usdcBalance = balances[`${network}_usdc`] || 0;

  const copyAddress = () => {
    navigator.clipboard.writeText(address);
    toast.success('Адрес скопирован');
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass p-5 rounded-xl"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{net.icon}</span>
          <div>
            <h3 className="text-white font-bold">{net.name}</h3>
            <p className="text-xs text-gray-500">{net.nativeCurrency}</p>
          </div>
        </div>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">{net.nativeCurrency}</span>
          <span className="text-white font-medium">{nativeBalance.toFixed(4)}</span>
        </div>
        {usdtBalance > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">USDT</span>
            <span className="text-green-400 font-medium">{usdtBalance.toFixed(2)}</span>
          </div>
        )}
        {usdcBalance > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">USDC</span>
            <span className="text-blue-400 font-medium">{usdcBalance.toFixed(2)}</span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 mb-4">
        <p className="text-xs text-gray-500 truncate flex-1">{address.slice(0, 10)}...{address.slice(-6)}</p>
        <button onClick={copyAddress} className="text-indigo-400 hover:text-indigo-300">
          <FiCopy size={14} />
        </button>
        <a href={`${net.explorer}${address}`} target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:text-indigo-300">
          <FiExternalLink size={14} />
        </a>
      </div>

      <div className="flex gap-2">
        <button onClick={onReceive} className="flex-1 py-2 rounded-lg bg-indigo-600/30 text-indigo-300 text-sm font-medium hover:bg-indigo-600/50 transition-colors">
          Пополнить
        </button>
        <button onClick={onSend} className="flex-1 py-2 rounded-lg bg-purple-600/30 text-purple-300 text-sm font-medium hover:bg-purple-600/50 transition-colors">
          Отправить
        </button>
      </div>
    </motion.div>
  );
}