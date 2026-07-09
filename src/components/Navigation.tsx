'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { FiRepeat, FiCreditCard, FiClock } from 'react-icons/fi';
import { useWallet } from '@/hooks/useWallet';

const NAV_ITEMS = [
  { href: '/', label: 'Обмен', icon: FiRepeat },
  { href: '/wallet', label: 'Кошелек', icon: FiCreditCard },
  { href: '/history', label: 'История', icon: FiClock },
];

export function Navigation() {
  const pathname = usePathname();
  const { wallet } = useWallet();

  return (
    <nav className="glass fixed bottom-0 left-0 right-0 z-40 lg:relative lg:glass lg:rounded-2xl lg:p-4">
      <div className="flex lg:flex-col items-center justify-around lg:justify-start lg:space-y-2 px-4 py-2 lg:py-0">
        {NAV_ITEMS.map(item => {
          const active = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link key={item.href} href={item.href} className="relative flex flex-col lg:flex-row items-center gap-1 lg:gap-3 px-3 lg:px-4 py-2 lg:py-3 rounded-xl transition-colors">
              {active && (
                <motion.div layoutId="nav-bg" className="absolute inset-0 bg-indigo-600/20 rounded-xl" />
              )}
              <Icon className={`relative z-10 ${active ? 'text-indigo-400' : 'text-gray-500'}`} size={20} />
              <span className={`relative z-10 text-xs lg:text-sm ${active ? 'text-indigo-400 font-medium' : 'text-gray-500'}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
      {wallet && (
        <div className="hidden lg:block mt-4 pt-4 border-t border-white/10 px-4">
          <p className="text-xs text-gray-500 truncate">
            {wallet.addresses['ethereum']?.slice(0, 8)}...{wallet.addresses['ethereum']?.slice(-6)}
          </p>
        </div>
      )}
    </nav>
  );
}