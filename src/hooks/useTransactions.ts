'use client';
import { useState, useEffect, useCallback } from 'react';
import { saveTransaction, getTransactions } from '@/lib/firestore';
import type { Transaction } from '@/types';

export function useTransactions(uid: string | undefined) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const load = useCallback(async () => {
    if (!uid) return;
    setLoading(true);
    const result = await getTransactions(uid);
    setTransactions(result.transactions);
    setHasMore(result.transactions.length === 10);
    setLoading(false);
  }, [uid]);

  useEffect(() => { load(); }, [load]);

  const addTransaction = useCallback(async (tx: Omit<Transaction, 'id' | 'timestamp'>) => {
    const id = await saveTransaction({ ...tx, uid: uid || '' });
    const newTx: Transaction = { ...tx, id, timestamp: Date.now() } as Transaction;
    setTransactions(prev => [newTx, ...prev]);
    return newTx;
  }, [uid]);

  return { transactions, loading, hasMore, page, setPage, load, addTransaction };
}