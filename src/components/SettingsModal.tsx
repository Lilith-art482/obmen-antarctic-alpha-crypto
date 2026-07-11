'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiSun, FiMoon } from 'react-icons/fi';
import { useTheme, LANG } from '@/hooks/useTheme';
import type { LanguageType, ColorSchemeType } from '@/types';

interface Props {
  open: boolean;
  onClose: () => void;
}

const LANGUAGES: { code: LanguageType; label: string }[] = [
  { code: 'ru', label: 'Русский' },
  { code: 'en', label: 'English' },
  { code: 'zh', label: '中文' },
];

const COLOR_SCHEMES: { code: ColorSchemeType; color: string }[] = [
  { code: 'purple', color: '#6366f1' },
  { code: 'green', color: '#10b981' },
  { code: 'blue', color: '#3b82f6' },
  { code: 'yellow', color: '#f59e0b' },
  { code: 'red', color: '#f43f5e' },
  { code: 'teal', color: '#14b8a6' },
];

export function SettingsModal({ open, onClose }: Props) {
  const { theme, language, colorScheme, setTheme, setLanguage, setColorScheme } = useTheme();
  const t = LANG[language];

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
              <h3 className="text-white font-bold text-lg">{t.settings_title}</h3>
              <button onClick={onClose} className="text-gray-400 hover:text-white"><FiX /></button>
            </div>

            <div className="space-y-6">
              <div>
                <label className="text-sm text-gray-400 mb-3 block">{t.theme}</label>
                <div className="flex gap-3">
                  <button
                    onClick={() => setTheme('dark')}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-medium transition-all ${
                      theme === 'dark' ? 'bg-accent text-white shadow-lg shadow-accent/30' : 'bg-white/10 text-gray-300 hover:bg-white/15'
                    }`}
                  >
                    <FiMoon size={18} />
                    {t.dark}
                  </button>
                  <button
                    onClick={() => setTheme('light')}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-medium transition-all ${
                      theme === 'light' ? 'bg-accent text-white shadow-lg shadow-accent/30' : 'bg-white/10 text-gray-300 hover:bg-white/15'
                    }`}
                  >
                    <FiSun size={18} />
                    {t.light}
                  </button>
                </div>
              </div>

              <div>
                <label className="text-sm text-gray-400 mb-3 block">{t.accent_color}</label>
                <div className="flex gap-3 flex-wrap justify-center">
                  {COLOR_SCHEMES.map(s => (
                    <button
                      key={s.code}
                      onClick={() => setColorScheme(s.code)}
                      className={`w-10 h-10 rounded-full transition-all ${
                        colorScheme === s.code ? 'ring-2 ring-white scale-110' : 'ring-1 ring-white/20 hover:scale-105'
                      }`}
                      style={{ backgroundColor: s.color }}
                      title={s.code}
                    />
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm text-gray-400 mb-3 block">{t.language}</label>
                <div className="flex gap-3">
                  {LANGUAGES.map(l => (
                    <button
                      key={l.code}
                      onClick={() => setLanguage(l.code)}
                      className={`flex-1 py-3 rounded-xl font-medium text-sm transition-all ${
                        language === l.code ? 'bg-accent text-white shadow-lg shadow-accent/30' : 'bg-white/10 text-gray-300 hover:bg-white/15'
                      }`}
                    >
                      {l.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
