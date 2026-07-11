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

export function Navigation({ onOpenProfile, onOpenSettings }: Props) {
  const pathname = usePathname();
  const { clearWallet } = useWallet();
  const { language } = useTheme();
  const t = LANG[language];

  const handleLogout = () => {
    clearWallet();
    window.location.reload();
  };

  return (
    <nav className="glass fixed bottom-0 left-0 right-0 z-40 lg:relative lg:glass lg:rounded-2xl lg:p-4 lg:h-full lg:flex lg:flex-col">
      <div className="flex lg:flex-col items-center justify-around lg:justify-start lg:space-y-2 px-4 py-2 lg:py-0 lg:flex-1">
        {NAV_ITEMS.map(item => {
          const active = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link key={item.href} href={item.href} className="relative flex flex-col lg:flex-row items-center gap-1 lg:gap-3 px-3 lg:px-4 py-2 lg:py-3 rounded-xl transition-colors w-full">
              {active && (
                <motion.div layoutId="nav-bg" className="absolute inset-0 bg-indigo-600/20 rounded-xl" />
              )}
              <Icon className={`relative z-10 ${active ? 'text-indigo-400' : 'text-gray-500'}`} size={20} />
              <span className={`relative z-10 text-xs lg:text-sm ${active ? 'text-indigo-400 font-medium' : 'text-gray-500'}`}>
                {item.labelKey === 'exchange' ? t.exchange : item.labelKey === 'wallet' ? t.wallet : t.history}
              </span>
            </Link>
          );
        })}
      </div>

      <div className="flex lg:hidden items-center justify-around border-t border-white/10 px-2 py-1">
        <button onClick={onOpenProfile} className="flex flex-col items-center gap-0.5 px-3 py-1 text-gray-500 hover:text-white transition-colors">
          <FiUser size={16} />
          <span className="text-[10px]">{t.profile}</span>
        </button>
        <button onClick={onOpenSettings} className="flex flex-col items-center gap-0.5 px-3 py-1 text-gray-500 hover:text-white transition-colors">
          <FiSettings size={16} />
          <span className="text-[10px]">{t.settings}</span>
        </button>
        <button onClick={handleLogout} className="flex flex-col items-center gap-0.5 px-3 py-1 text-red-400/60 hover:text-red-400 transition-colors">
          <FiLogOut size={16} />
          <span className="text-[10px]">{t.logout}</span>
        </button>
      </div>

      <div className="hidden lg:flex flex-col border-t border-white/10 pt-2 mt-2 px-2 space-y-1">
        <button onClick={onOpenProfile} className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-all w-full">
          <FiUser size={18} />
          <span className="text-sm">{t.profile}</span>
        </button>
        <button onClick={onOpenSettings} className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-all w-full">
          <FiSettings size={18} />
          <span className="text-sm">{t.settings}</span>
        </button>
        <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all w-full">
          <FiLogOut size={18} />
          <span className="text-sm">{t.logout}</span>
        </button>
      </div>
    </nav>
  );
}
