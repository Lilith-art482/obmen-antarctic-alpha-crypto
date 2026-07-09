import { ethers } from 'ethers';

const ETH_RPC = process.env.NEXT_PUBLIC_ETH_RPC || 'https://cloudflare-eth.com';
const SOL_RPC = process.env.NEXT_PUBLIC_SOL_RPC || 'https://api.mainnet-beta.solana.com';
const TON_API = process.env.NEXT_PUBLIC_TON_API || 'https://toncenter.com/api/v2';
const TRON_RPC = process.env.NEXT_PUBLIC_TRON_RPC || 'https://api.trongrid.io';
const BSC_RPC = process.env.NEXT_PUBLIC_BSC_RPC || 'https://bsc-dataseed.binance.org';

const ERC20_ABI = [
  'function balanceOf(address owner) view returns (uint256)',
  'function decimals() view returns (uint8)',
  'function symbol() view returns (string)',
];

const USDT_ETH_ADDRESS = '0xdAC17F958D2ee523a2206206994597C13D831ec7';
const USDC_ETH_ADDRESS = '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48';

export async function getEthBalance(address: string): Promise<number> {
  try {
    const provider = new ethers.JsonRpcProvider(ETH_RPC);
    const balance = await provider.getBalance(address);
    return Number(ethers.formatEther(balance));
  } catch {
    throw new Error('Ошибка соединения с сетью Ethereum');
  }
}

export async function getErc20Balance(address: string, token: 'USDT' | 'USDC'): Promise<number> {
  try {
    const provider = new ethers.JsonRpcProvider(ETH_RPC);
    const tokenAddress = token === 'USDT' ? USDT_ETH_ADDRESS : USDC_ETH_ADDRESS;
    const contract = new ethers.Contract(tokenAddress, ERC20_ABI, provider);
    const balance = await contract.balanceOf(address);
    const decimals = await contract.decimals();
    return Number(ethers.formatUnits(balance, decimals));
  } catch {
    throw new Error('Ошибка соединения с сетью Ethereum');
  }
}

export async function getSolBalance(address: string): Promise<number> {
  try {
    const { Connection, PublicKey } = await import('@solana/web3.js');
    const connection = new Connection(SOL_RPC);
    const pubKey = new PublicKey(address);
    const balance = await connection.getBalance(pubKey);
    return balance / 1e9;
  } catch {
    throw new Error('Ошибка соединения с сетью Solana');
  }
}

export async function getSolSplBalance(address: string, mint: string): Promise<number> {
  try {
    const { Connection, PublicKey } = await import('@solana/web3.js');
    const connection = new Connection(SOL_RPC);
    const pubKey = new PublicKey(address);
    const tokenPubKey = new PublicKey(mint);
    const accounts = await connection.getProgramAccounts(
      new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'),
      {
        filters: [
          { dataSize: 165 },
          { memcmp: { offset: 32, bytes: pubKey.toBase58() } },
        ],
      }
    );
    for (const acc of accounts) {
      const mintBytes = acc.account.data.slice(0, 32);
      const parsedMint = new PublicKey(mintBytes);
      if (parsedMint.toBase58() === tokenPubKey.toBase58()) {
        const amount = Number(acc.account.data.slice(64, 72).readBigUInt64LE(0));
        return amount / Math.pow(10, 6);
      }
    }
    return 0;
  } catch {
    throw new Error('Ошибка соединения с сетью Solana');
  }
}

export async function getTonBalance(address: string): Promise<number> {
  try {
    const TonWeb = (await import('tonweb')).default;
    const tonweb = new TonWeb(new TonWeb.HttpProvider(TON_API));
    const balance = await tonweb.getBalance(address);
    return Number(balance) / 1e9;
  } catch {
    throw new Error('Ошибка соединения с сетью TON');
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let TronWebClass: any;

async function getTronWebInstance() {
  if (!TronWebClass) {
    const mod = await import('tronweb');
    TronWebClass = mod.TronWeb;
  }
  return new TronWebClass({ fullHost: TRON_RPC });
}

export async function getTronBalance(address: string): Promise<number> {
  try {
    const tronWeb = await getTronWebInstance();
    const balance = await tronWeb.trx.getBalance(address);
    return balance / 1e6;
  } catch {
    throw new Error('Ошибка соединения с сетью Tron');
  }
}

export async function getTronTrc20Balance(address: string): Promise<number> {
  try {
    const tronWeb = await getTronWebInstance();
    const contract = await tronWeb.contract().at('TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t');
    const balance = await contract.balanceOf(address).call();
    return Number(balance) / 1e6;
  } catch {
    throw new Error('Ошибка соединения с сетью Tron');
  }
}

export async function getBscBalance(address: string): Promise<number> {
  try {
    const provider = new ethers.JsonRpcProvider(BSC_RPC);
    const balance = await provider.getBalance(address);
    return Number(ethers.formatEther(balance));
  } catch {
    throw new Error('Ошибка соединения с сетью BNB Chain');
  }
}