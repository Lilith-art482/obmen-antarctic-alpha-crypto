'use client';
import { motion } from 'framer-motion';
import { SwapWidget } from '@/components/SwapWidget';
import { TopAssets } from '@/components/TopAssets';
import ClientLayout from '@/components/ClientLayout';

export default function Dashboard() {
  return (
    <ClientLayout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-8"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <SwapWidget />
          <div className="space-y-6">
            <TopAssets />
            <div className="glass p-6 rounded-2xl">
              <h3 className="text-lg font-bold text-white mb-4">Статистика</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 p-4 rounded-xl">
                  <p className="text-gray-400 text-xs mb-1">Всего активов</p>
                  <p className="text-white font-bold text-xl">7</p>
                </div>
                <div className="bg-white/5 p-4 rounded-xl">
                  <p className="text-gray-400 text-xs mb-1">Сети</p>
                  <p className="text-white font-bold text-xl">5</p>
                </div>
                <div className="bg-white/5 p-4 rounded-xl">
                  <p className="text-gray-400 text-xs mb-1">Подключение Binance</p>
                  <p className="text-green-400 font-bold text-xl">Live</p>
                </div>
                <div className="bg-white/5 p-4 rounded-xl">
                  <p className="text-gray-400 text-xs mb-1">Статус</p>
                  <p className="text-indigo-400 font-bold text-xl">Онлайн</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </ClientLayout>
  );
}