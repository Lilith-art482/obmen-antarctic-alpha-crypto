'use client';
import { useState, useEffect, useCallback, useRef } from 'react';
import { fetchBalances } from '@/lib/balances';

interface BalanceState {
  [key: string]: number;
}

export function useCryptoBalance(address: string, networks: string[]) {
  const [balances, setBalances] = useState<BalanceState>({});
  const [loading, setLoading] = useState(true);
  const intervalRef = useRef<NodeJS.Timeout>();
  const networksRef = useRef(networks);
  networksRef.current = networks;

  const load = useCallback(async () => {
    const currentNetworks = networksRef.current;
    if (!address || currentNetworks.length === 0) return;
    setLoading(true);
    const result = await fetchBalances(address, currentNetworks);
    setBalances(prev => ({ ...prev, ...result }));
    setLoading(false);
  }, [address]);

  useEffect(() => {
    load();
    intervalRef.current = setInterval(load, 30000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [load]);

  const getBalance = useCallback((network: string, symbol?: string): number => {
    const key = symbol ? `${network}_${symbol.toLowerCase()}` : network;
    return balances[key] || 0;
  }, [balances]);

  return { balances, loading, refetch: load, getBalance };
}