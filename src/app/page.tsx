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
        className="w-full max-w-4xl mx-auto"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <SwapWidget />
          <TopAssets />
        </div>
      </motion.div>
    </ClientLayout>
  );
}
