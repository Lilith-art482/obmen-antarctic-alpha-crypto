const USDT_SPL_MINT = 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB';
const USDC_SPL_MINT = 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v';

const CACHE_DURATION = 30000; // 30 seconds

interface CacheEntry {
  value: number;
  expiry: number;
}

function getCached(key: string): number | null {
  try {
    const raw = localStorage.getItem(`balance_${key}`);
    if (raw) {
      const entry: CacheEntry = JSON.parse(raw);
      if (Date.now() < entry.expiry) return entry.value;
    }
  } catch {}
  return null;
}

function setCache(key: string, value: number) {
  try {
    localStorage.setItem(`balance_${key}`, JSON.stringify({ value, expiry: Date.now() + CACHE_DURATION }));
  } catch {}
}

import {
  getEthBalance, getErc20Balance,
  getSolBalance, getSolSplBalance,
  getTonBalance,
  getTronBalance, getTronTrc20Balance,
  getBscBalance,
} from './rpc';

type BalanceMap = Record<string, number>;

export async function fetchBalances(address: string, networks: string[]): Promise<BalanceMap> {
  const results: BalanceMap = {};

  const promises = networks.map(async (network) => {
    const cacheKey = `${address}_${network}`;
    const cached = getCached(cacheKey);
    if (cached !== null) { results[network] = cached; return; }

    try {
      let balance = 0;
      switch (network) {
        case 'ethereum': {
          balance = await getEthBalance(address);
          const usdtEth = await getErc20Balance(address, 'USDT');
          const usdcEth = await getErc20Balance(address, 'USDC');
          results['ethereum_usdt'] = usdtEth;
          results['ethereum_usdc'] = usdcEth;
          setCache(`${address}_ethereum_usdt`, usdtEth);
          setCache(`${address}_ethereum_usdc`, usdcEth);
          break;
        }
        case 'solana': {
          balance = await getSolBalance(address);
          const usdtSol = await getSolSplBalance(address, USDT_SPL_MINT);
          const usdcSol = await getSolSplBalance(address, USDC_SPL_MINT);
          results['solana_usdt'] = usdtSol;
          results['solana_usdc'] = usdcSol;
          setCache(`${address}_solana_usdt`, usdtSol);
          setCache(`${address}_solana_usdc`, usdcSol);
          break;
        }
        case 'ton': {
          balance = await getTonBalance(address);
          break;
        }
        case 'tron': {
          balance = await getTronBalance(address);
          const usdtTron = await getTronTrc20Balance(address);
          results['tron_usdt'] = usdtTron;
          setCache(`${address}_tron_usdt`, usdtTron);
          break;
        }
        case 'bsc': {
          balance = await getBscBalance(address);
          break;
        }
      }
      results[network] = balance;
      setCache(cacheKey, balance);
    } catch (e: unknown) {
      console.warn(`Balance fetch error for ${network}:`, e instanceof Error ? e.message : e);
      results[network] = 0;
    }
  });

  await Promise.allSettled(promises);
  return results;
}