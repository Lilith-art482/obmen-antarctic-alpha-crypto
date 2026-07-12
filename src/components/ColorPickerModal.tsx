'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiCheck } from 'react-icons/fi';
import { useTheme } from '@/hooks/useTheme';
import type { ColorSchemeType } from '@/types';

interface Props {
  open: boolean;
  onClose: () => void;
}

const ALL_COLORS: { code: ColorSchemeType; color: string; label: string; group: string }[] = [
  { code: 'purple', color: '#6366f1', label: 'Purple', group: 'Основные' },
  { code: 'blue', color: '#3b82f6', label: 'Blue', group: 'Основные' },
  { code: 'green', color: '#10b981', label: 'Green', group: 'Основные' },
  { code: 'teal', color: '#14b8a6', label: 'Teal', group: 'Основные' },
  { code: 'yellow', color: '#f59e0b', label: 'Yellow', group: 'Основные' },
  { code: 'red', color: '#f43f5e', label: 'Red', group: 'Основные' },
  { code: 'spruce', color: '#065f46', label: 'Spruce', group: 'Тёмные' },
  { code: 'lavender', color: '#a78bfa', label: 'Lavender', group: 'Пастельные' },
  { code: 'lilac', color: '#c084fc', label: 'Lilac', group: 'Пастельные' },
  { code: 'sky', color: '#7dd3fc', label: 'Sky Blue', group: 'Пастельные' },
  { code: 'mint', color: '#6ee7b7', label: 'Mint', group: 'Пастельные' },
  { code: 'sage', color: '#86efac', label: 'Sage', group: 'Пастельные' },
  { code: 'pistachio', color: '#a7f3d0', label: 'Pistachio', group: 'Пастельные' },
  { code: 'vanilla', color: '#f5e6ca', label: 'Vanilla', group: 'Светлые' },
  { code: 'lemon', color: '#fef08a', label: 'Lemon', group: 'Светлые' },
  { code: 'ivory', color: '#fef3c7', label: 'Ivory', group: 'Светлые' },
  { code: 'beige', color: '#f5deb3', label: 'Warm Beige', group: 'Светлые' },
  { code: 'pearl', color: '#d1d5db', label: 'Pearl Gray', group: 'Светлые' },
];

const GROUPS = ['Основные', 'Тёмные', 'Пастельные', 'Светлые'];

export function ColorPickerModal({ open, onClose }: Props) {
  const { colorScheme, setColorScheme } = useTheme();

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={e => e.stopPropagation()}
            className="glass p-6 rounded-2xl max-w-lg w-full mx-4 max-h-[80vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-white font-bold text-lg">Цветовая гамма</h3>
              <button onClick={onClose} className="text-gray-400 hover:text-white"><FiX /></button>
            </div>

            <div className="space-y-6">
              {GROUPS.map(group => (
                <div key={group}>
                  <label className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-3 block">{group}</label>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                    {ALL_COLORS.filter(c => c.group === group).map(s => (
                      <button
                        key={s.code}
                        onClick={() => { setColorScheme(s.code); onClose(); }}
                        className={`flex flex-col items-center gap-1.5 p-2.5 rounded-xl transition-all ${
                          colorScheme === s.code
                            ? 'bg-white/10 ring-1 ring-white/30'
                            : 'hover:bg-white/5'
                        }`}
                      >
                        <div
                          className={`w-8 h-8 rounded-lg transition-all ${
                            colorScheme === s.code ? 'scale-110 ring-2 ring-white' : ''
                          }`}
                          style={{ backgroundColor: s.color }}
                        >
                          {colorScheme === s.code && (
                            <div className="w-full h-full flex items-center justify-center">
                              <FiCheck size={14} className="text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]" />
                            </div>
                          )}
                        </div>
                        <span className={`text-[10px] font-medium truncate w-full text-center ${
                          colorScheme === s.code ? 'text-white' : 'text-gray-400'
                        }`}>
                          {s.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
