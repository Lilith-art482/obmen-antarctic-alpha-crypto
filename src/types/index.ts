export interface TokenInfo {
  symbol: string;
  name: string;
  icon: string;
  networks: NetworkType[];
  decimals: number;
  address?: string;
}

export type NetworkType = 'ethereum' | 'solana' | 'ton' | 'tron' | 'bsc';
export type ThemeType = 'dark' | 'light';
export type LanguageType = 'ru' | 'en' | 'zh';
export type ColorSchemeType = 'purple' | 'green' | 'blue' | 'yellow' | 'red' | 'teal'
  | 'lavender' | 'spruce' | 'sky' | 'mint' | 'vanilla' | 'lemon'
  | 'lilac' | 'sage' | 'pistachio' | 'ivory' | 'pearl' | 'beige';

export interface NetworkInfo {
  id: NetworkType;
  name: string;
  icon: string;
  explorer: string;
  nativeCurrency: string;
}

export interface SwapQuote {
  fromToken: string;
  toToken: string;
  fromAmount: number;
  toAmount: number;
  networkFee: number;
  rate: number;
}

export interface Transaction {
  id: string;
  uid: string;
  fromToken: string;
  toToken: string;
  fromAmount: number;
  toAmount: number;
  network: NetworkType;
  txHash: string;
  status: 'pending' | 'success' | 'failed';
  timestamp: number;
  type: 'swap' | 'send' | 'receive';
}

export interface WalletData {
  addresses: Record<NetworkType, string>;
  uid: string;
  createdAt: number;
}

export interface CryptoBalance {
  symbol: string;
  balance: number;
  usdValue: number;
  network: NetworkType;
}

export interface PriceData {
  symbol: string;
  price: number;
  change24h: number;
  high24h: number;
  low24h: number;
}

export const SUPPORTED_TOKENS: TokenInfo[] = [
  { symbol: 'ETH', name: 'Ethereum', icon: '⟠', networks: ['ethereum'], decimals: 18 },
  { symbol: 'USDT', name: 'Tether', icon: '₮', networks: ['ethereum', 'solana', 'ton', 'tron'], decimals: 6 },
  { symbol: 'USDC', name: 'USD Coin', icon: '○', networks: ['ethereum', 'solana'], decimals: 6 },
  { symbol: 'SOL', name: 'Solana', icon: '◎', networks: ['solana'], decimals: 9 },
  { symbol: 'GRAM', name: 'GRAM', icon: '⬡', networks: ['ton'], decimals: 9 },
  { symbol: 'TRX', name: 'Tron', icon: '◈', networks: ['tron'], decimals: 6 },
  { symbol: 'BNB', name: 'BNB', icon: '◆', networks: ['bsc'], decimals: 18 },
];

export const NETWORKS: Record<NetworkType, NetworkInfo> = {
  ethereum: { id: 'ethereum', name: 'Ethereum', icon: '⟠', explorer: 'https://etherscan.io/tx/', nativeCurrency: 'ETH' },
  solana: { id: 'solana', name: 'Solana', icon: '◎', explorer: 'https://solscan.io/tx/', nativeCurrency: 'SOL' },
  ton: { id: 'ton', name: 'TON', icon: '⬡', explorer: 'https://tonscan.org/tx/', nativeCurrency: 'TON' },
  tron: { id: 'tron', name: 'Tron', icon: '◈', explorer: 'https://tronscan.org/#/transaction/', nativeCurrency: 'TRX' },
  bsc: { id: 'bsc', name: 'BNB Chain', icon: '◆', explorer: 'https://bscscan.com/tx/', nativeCurrency: 'BNB' },
};