'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWallet } from '@/hooks/useWallet';
import { FiShield, FiEye, FiEyeOff } from 'react-icons/fi';
import toast from 'react-hot-toast';

export function PinSetupModal() {
  const { pin, setPin, mnemonic, mnemonicShown, markMnemonicShown, loading } = useWallet();
  const [showPinSetup, setShowPinSetup] = useState(false);
  const [showMnemonic, setShowMnemonic] = useState(false);
  const [pinInput, setPinInput] = useState(['', '', '', '']);
  const [confirmPin, setConfirmPin] = useState(['', '', '', '']);
  const [step, setStep] = useState<'pin' | 'confirm' | 'mnemonic'>('pin');
  const [confirmedMnemonic, setConfirmedMnemonic] = useState(false);

  useEffect(() => {
    if (!loading && !pin) {
      setShowPinSetup(true);
    }
  }, [loading, pin]);

  const handlePinSubmit = () => {
    const pinStr = pinInput.join('');
    if (pinStr.length !== 4) { toast.error('Введите 4 цифры'); return; }

    if (step === 'pin') {
      setStep('confirm');
    } else {
      const confirmStr = confirmPin.join('');
      if (pinStr !== confirmStr) { toast.error('PIN-коды не совпадают'); setStep('pin'); setPinInput(['', '', '', '']); setConfirmPin(['', '', '', '']); return; }
      setPin(pinStr);
      toast.success('PIN-код установлен');
      if (mnemonic && !mnemonicShown) {
        setStep('mnemonic');
      } else {
        setShowPinSetup(false);
      }
    }
  };

  const handleMnemonicDone = () => {
    markMnemonicShown();
    setShowPinSetup(false);
    toast.success('Кошелек создан! Сохраните мнемоническую фразу.');
  };

  if (!showPinSetup) return null;

  return (
    <AnimatePresence>
      {showPinSetup && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="glass p-8 rounded-2xl max-w-sm w-full mx-4"
          >
            {step === 'mnemonic' ? (
              <>
                <div className="text-center mb-6">
                  <FiShield className="text-4xl text-indigo-400 mx-auto mb-2" />
                  <h3 className="text-white font-bold text-lg">Мнемоническая фраза</h3>
                  <p className="text-gray-400 text-sm mt-1">Сохраните ее в надежном месте. Фраза показывается только один раз!</p>
                </div>
                <div className="bg-black/40 p-4 rounded-xl mb-4">
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    {mnemonic?.split(' ').map((word, i) => (
                      <div key={i} className="flex items-center gap-1">
                        <span className="text-indigo-500">{i + 1}.</span>
                        <span className={showMnemonic ? 'text-white' : 'text-transparent bg-gray-700 rounded px-2 select-none'}>
                          {showMnemonic ? word : '••••'}
                        </span>
                      </div>
                    ))}
                  </div>
                  <button onClick={() => setShowMnemonic(!showMnemonic)} className="text-indigo-400 text-xs mt-2 flex items-center gap-1 mx-auto">
                    {showMnemonic ? <FiEyeOff /> : <FiEye />} {showMnemonic ? 'Скрыть' : 'Показать'}
                  </button>
                </div>
                <label className="flex items-center gap-2 text-sm text-gray-300 mb-4">
                  <input type="checkbox" checked={confirmedMnemonic} onChange={e => setConfirmedMnemonic(e.target.checked)} className="accent-indigo-600" />
                  Я сохранил фразу в надежном месте
                </label>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleMnemonicDone}
                  disabled={!confirmedMnemonic}
                  className="w-full py-3 rounded-xl font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 disabled:opacity-40"
                >
                  Готово
                </motion.button>
              </>
            ) : (
              <>
                <h3 className="text-white font-bold text-lg mb-2 text-center">Создание PIN-кода</h3>
                <p className="text-gray-400 text-sm mb-6 text-center">{step === 'pin' ? 'Придумайте PIN-код из 4 цифр' : 'Подтвердите PIN-код'}</p>
                <div className="flex justify-center gap-4 mb-6">
                  {((step === 'pin' ? pinInput : confirmPin) as string[]).map((digit, i) => (
                    <input
                      key={i}
                      type="password"
                      maxLength={1}
                      value={digit}
                      onChange={e => {
                        const val = e.target.value.replace(/\D/g, '');
                        if (step === 'pin') {
                          const newArr = [...pinInput];
                          newArr[i] = val;
                          setPinInput(newArr);
                        } else {
                          const newArr = [...confirmPin];
                          newArr[i] = val;
                          setConfirmPin(newArr);
                        }
                        if (val && i < 3) {
                          const next = document.getElementById(`pin-${step}-${i + 1}`);
                          next?.focus();
                        }
                      }}
                      id={`pin-${step}-${i}`}
                      className="w-14 h-14 bg-white/10 text-white text-2xl text-center rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  ))}
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handlePinSubmit}
                  className="w-full py-3 rounded-xl font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600"
                >
                  {step === 'pin' ? 'Далее' : 'Подтвердить'}
                </motion.button>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}