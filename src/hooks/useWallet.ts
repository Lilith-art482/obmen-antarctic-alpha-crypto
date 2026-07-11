'use client';
import { useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { ethers } from 'ethers';
import type { WalletData, NetworkType } from '@/types';

const WALLET_KEY = 'crypto_wallet';

export function useWallet() {
  const [wallet, setWallet] = useState<WalletData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = sessionStorage.getItem(WALLET_KEY);
    if (saved) {
      try {
        setWallet(JSON.parse(saved));
        setLoading(false);
        return;
      } catch {
        // invalid data, create new
      }
    }

    const networks: NetworkType[] = ['ethereum', 'solana', 'ton', 'tron', 'bsc'];
    const addresses: Record<string, string> = {};
    networks.forEach(n => {
      addresses[n] = ethers.Wallet.createRandom().address;
    });

    const newWallet: WalletData = {
      addresses: addresses as Record<NetworkType, string>,
      uid: uuidv4(),
      createdAt: Date.now(),
    };

    sessionStorage.setItem(WALLET_KEY, JSON.stringify(newWallet));
    setWallet(newWallet);
    setLoading(false);
  }, []);

  const clearWallet = useCallback(() => {
    sessionStorage.removeItem(WALLET_KEY);
    setWallet(null);
  }, []);

  return {
    wallet,
    loading,
    clearWallet,
    getAddress: (network: NetworkType) => wallet?.addresses[network] || '',
  };
}
