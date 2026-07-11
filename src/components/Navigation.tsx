'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { FiRepeat, FiCreditCard, FiClock, FiUser, FiSettings, FiLogOut } from 'react-icons/fi';
import { useWallet } from '@/hooks/useWallet';
import { useTheme, LANG } from '@/hooks/useTheme';

interface Props {
  onOpenProfile: () => void;
  onOpenSettings: () => void;
}

const NAV_ITEMS = [
  { href: '/', labelKey: 'exchange', icon: FiRepeat },
  { href: '/wallet', labelKey: 'wallet', icon: FiCreditCard },
  { href: '/history', labelKey: 'history', icon: FiClock },
];

const BOTTOM_ITEMS = [
  { key: 'profile', icon: FiUser },
  { key: 'settings', icon: FiSettings },
];

export function Navigation({ onOpenProfile, onOpenSettings }: Props) {
  const pathname = usePathname();
  const { clearWallet } = useWallet();
  const { language } = useTheme();
  const t = LANG[language];

  const handleLogout = () => {
    clearWallet();
    window.location.reload();
  };

  const handleSecondaryClick = (key: string) => {
    if (key === 'profile') onOpenProfile();
    if (key === 'settings') onOpenSettings();
  };

  return (
    <nav className="glass fixed bottom-0 left-0 right-0 z-40 lg:relative lg:glass lg:rounded-2xl lg:p-0 lg:h-full lg:flex lg:flex-col">
      {/* Logo */}
      <div className="hidden lg:flex items-center gap-3 px-5 py-5 border-b border-white/5">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent to-accent-dark flex items-center justify-center text-white font-bold text-sm">
          C
        </div>
        <span className="text-white font-bold text-lg">CryptoSwap</span>
      </div>

      {/* Main nav items */}
      <div className="flex lg:flex-col items-center justify-around lg:justify-start lg:flex-1 px-2 py-2 lg:py-4 lg:px-3">
        <div className="hidden lg:block text-[10px] uppercase tracking-widest text-gray-600 font-semibold px-3 mb-2">
          Меню
        </div>
        {NAV_ITEMS.map(item => {
          const active = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link key={item.href} href={item.href} className={`relative flex flex-col lg:flex-row items-center gap-1 lg:gap-3 px-3 lg:px-4 py-2 lg:py-2.5 rounded-xl transition-all w-full group ${
              active ? 'text-accent' : 'text-gray-500 hover:text-gray-300'
            }`}>
              {active && (
                <motion.div layoutId="nav-bg" className="absolute inset-0 bg-accent/15 rounded-xl border border-accent/20" />
              )}
              <div className={`relative z-10 p-1.5 rounded-lg transition-colors ${
                active ? 'bg-accent/20 text-accent' : 'text-gray-500 group-hover:text-gray-300'
              }`}>
                <Icon size={18} />
              </div>
              <span className={`relative z-10 text-[11px] lg:text-sm font-medium ${
                active ? 'text-accent' : 'text-gray-500 group-hover:text-gray-300'
              }`}>
                {item.labelKey === 'exchange' ? t.exchange : item.labelKey === 'wallet' ? t.wallet : t.history}
              </span>
            </Link>
          );
        })}
      </div>

      {/* Bottom section - desktop */}
      <div className="hidden lg:flex flex-col border-t border-white/5 pt-3 pb-4 px-3 space-y-0.5">
        {BOTTOM_ITEMS.map(item => {
          const Icon = item.icon;
          return (
            <button
              key={item.key}
              onClick={() => handleSecondaryClick(item.key)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-500 hover:text-gray-300 hover:bg-white/5 transition-all w-full group"
            >
              <div className="p-1.5 rounded-lg group-hover:bg-white/5 transition-colors">
                <Icon size={18} />
              </div>
              <span className="text-sm">
                {item.key === 'profile' ? t.profile : t.settings}
              </span>
            </button>
          );
        })}
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-400/60 hover:text-red-400 hover:bg-red-500/10 transition-all w-full group"
        >
          <div className="p-1.5 rounded-lg group-hover:bg-red-500/10 transition-colors">
            <FiLogOut size={18} />
          </div>
          <span className="text-sm">{t.logout}</span>
        </button>
      </div>

      {/* Bottom section - mobile */}
      <div className="flex lg:hidden items-center justify-around border-t border-white/5 px-2 py-1.5">
        {BOTTOM_ITEMS.map(item => {
          const Icon = item.icon;
          return (
            <button
              key={item.key}
              onClick={() => handleSecondaryClick(item.key)}
              className="flex flex-col items-center gap-0.5 px-3 py-1 text-gray-500 hover:text-white transition-colors"
            >
              <Icon size={16} />
              <span className="text-[10px]">{item.key === 'profile' ? t.profile : t.settings}</span>
            </button>
          );
        })}
        <button
          onClick={handleLogout}
          className="flex flex-col items-center gap-0.5 px-3 py-1 text-red-400/60 hover:text-red-400 transition-colors"
        >
          <FiLogOut size={16} />
          <span className="text-[10px]">{t.logout}</span>
        </button>
      </div>
    </nav>
  );
}
