'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX } from 'react-icons/fi';
import toast from 'react-hot-toast';

interface Props {
  open: boolean;
  onClose: () => void;
  onSend: (to: string, amount: number) => void;
  balance: number;
}

export function SendModal({ open, onClose, onSend, balance }: Props) {
  const [address, setAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [pin, setPin] = useState('');

  const handleSend = () => {
    if (!address || !amount) { toast.error('Заполните все поля'); return; }
    if (parseFloat(amount) > balance) { toast.error('Недостаточно средств'); return; }
    if (!pin || pin.length !== 4) { toast.error('Введите PIN-код (4 цифры)'); return; }
    onSend(address, parseFloat(amount));
    toast.success('Транзакция отправлена (симуляция)');
    setAddress('');
    setAmount('');
    setPin('');
    onClose();
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
              <h3 className="text-white font-bold">Отправить</h3>
              <button onClick={onClose} className="text-gray-400 hover:text-white"><FiX /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-400 mb-1 block">Адрес получателя</label>
                <input
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  className="w-full bg-white/10 text-white rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="0x..."
                />
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-1 block">Сумма</label>
                <div className="relative">
                  <input
                    type="number"
                    value={amount}
                    onChange={e => setAmount(e.target.value)}
                    className="w-full bg-white/10 text-white rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="0.00"
                  />
                  <span className="absolute right-4 top-3 text-gray-400 text-sm">Баланс: {balance.toFixed(4)}</span>
                </div>
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-1 block">PIN-код (4 цифры)</label>
                <input
                  type="password"
                  maxLength={4}
                  value={pin}
                  onChange={e => setPin(e.target.value.replace(/\D/g, ''))}
                  className="w-full bg-white/10 text-white rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500 text-center text-2xl tracking-widest"
                  placeholder="****"
                />
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSend}
                className="w-full py-3 rounded-xl font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600"
              >
                Отправить
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}