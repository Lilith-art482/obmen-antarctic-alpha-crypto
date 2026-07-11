'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiCopy } from 'react-icons/fi';
import { useWallet } from '@/hooks/useWallet';
import { useTheme, LANG } from '@/hooks/useTheme';
import toast from 'react-hot-toast';

interface Props {
  open: boolean;
  onClose: () => void;
}

export function ProfileModal({ open, onClose }: Props) {
  const { wallet } = useWallet();
  const { language } = useTheme();
  const t = LANG[language];

  const copyAddress = (addr: string) => {
    navigator.clipboard.writeText(addr);
    toast.success('Адрес скопирован');
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={e => e.stopPropagation()}
            className="glass p-6 rounded-2xl max-w-sm w-full mx-4"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-white font-bold text-lg">{t.profile_title}</h3>
              <button onClick={onClose} className="text-gray-400 hover:text-white"><FiX /></button>
            </div>

            <div className="space-y-4">
              {wallet && Object.entries(wallet.addresses).map(([network, address]) => (
                <div key={network} className="bg-white/5 p-3 rounded-xl">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-400 uppercase">{network}</span>
                    <button onClick={() => copyAddress(address)} className="text-gray-400 hover:text-indigo-400 transition-colors">
                      <FiCopy size={14} />
                    </button>
                  </div>
                  <p className="text-sm text-white font-mono truncate">{address}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
