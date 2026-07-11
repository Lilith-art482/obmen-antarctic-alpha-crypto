'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';
import { FiX, FiCopy } from 'react-icons/fi';
import type { NetworkType } from '@/types';
import { NETWORKS } from '@/types';
import toast from 'react-hot-toast';

interface Props {
  open: boolean;
  onClose: () => void;
  network: NetworkType;
  address: string;
}

export function ReceiveModal({ open, onClose, network, address }: Props) {
  const copy = () => {
    navigator.clipboard.writeText(address);
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
            className="glass p-8 rounded-2xl max-w-sm w-full mx-4 text-center"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-white font-bold text-lg">Пополнить {NETWORKS[network]?.name}</h3>
              <button onClick={onClose} className="text-gray-400 hover:text-white"><FiX /></button>
            </div>
            <div className="bg-white p-4 rounded-xl inline-block mb-4">
              <QRCodeSVG value={address} size={200} />
            </div>
            <p className="text-xs text-gray-400 mb-2 break-all bg-white/5 p-3 rounded-lg">{address}</p>
            <button onClick={copy} className="text-accent hover:text-accent-lighter text-sm flex items-center gap-1 mx-auto">
              <FiCopy /> Копировать адрес
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}