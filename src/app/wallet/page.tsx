'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { WalletTile } from '@/components/WalletTile';
import { ReceiveModal } from '@/components/ReceiveModal';
import { SendModal } from '@/components/SendModal';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import ClientLayout from '@/components/ClientLayout';
import { useWallet } from '@/hooks/useWallet';
import { useCryptoBalance } from '@/hooks/useCryptoBalance';
import type { NetworkType } from '@/types';

const NETWORKS: NetworkType[] = ['ethereum', 'solana', 'ton', 'tron', 'bsc'];

export default function WalletPage() {
  const { wallet, getAddress } = useWallet();
  const [receiveNet, setReceiveNet] = useState<NetworkType | null>(null);
  const [sendNet, setSendNet] = useState<NetworkType | null>(null);

  const address = wallet ? getAddress('ethereum') : '';
  const { balances } = useCryptoBalance(address, NETWORKS);

  return (
    <ClientLayout>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
        <h1 className="text-2xl font-bold text-white">Кошелек</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {NETWORKS.map(net => (
            <ErrorBoundary key={net}>
              <WalletTile
                network={net}
                address={wallet?.addresses[net] || ''}
                balances={balances}
                onSend={() => setSendNet(net)}
                onReceive={() => setReceiveNet(net)}
              />
            </ErrorBoundary>
          ))}
        </div>
      </motion.div>

      {receiveNet && wallet && (
        <ReceiveModal
          open={!!receiveNet}
          onClose={() => setReceiveNet(null)}
          network={receiveNet}
          address={wallet.addresses[receiveNet]}
        />
      )}

      {sendNet && wallet && (
        <SendModal
          open={!!sendNet}
          onClose={() => setSendNet(null)}
          balance={balances[sendNet] || 0}
          onSend={(to, amount) => {
            console.log('Send', to, amount, 'on', sendNet);
          }}
        />
      )}
    </ClientLayout>
  );
}