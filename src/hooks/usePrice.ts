'use client';
import { useState, useEffect, useCallback, useRef } from 'react';
import type { PriceData } from '@/types';

const WS_URL = 'wss://stream.binance.com:9443/ws';
const STREAMS = ['ethusdt', 'bnbusdt', 'solusdt', 'trxusdt', 'gramusdt'];

export function usePrices() {
  const [prices, setPrices] = useState<Record<string, PriceData>>({});
  const [connected, setConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const streams = STREAMS.map(s => `${s}@ticker`).join('/');
    const url = `${WS_URL}/${streams}`;
    const ws = new WebSocket(url);
    wsRef.current = ws;

    ws.onopen = () => setConnected(true);
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      const symbol = data.s.replace('USDT', '').toUpperCase();
      setPrices(prev => ({
        ...prev,
        [symbol]: {
          symbol,
          price: parseFloat(data.c),
          change24h: parseFloat(data.P),
          high24h: parseFloat(data.h),
          low24h: parseFloat(data.l),
        },
      }));
    };
    ws.onerror = () => setConnected(false);
    ws.onclose = () => setConnected(false);

    return () => ws.close();
  }, []);

  const getPrice = useCallback((symbol: string): number => {
    return prices[symbol]?.price || 0;
  }, [prices]);

  return { prices, connected, getPrice };
}