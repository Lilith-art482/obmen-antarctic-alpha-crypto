import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'CryptoSwap - Обменник и кошелек',
  description: 'Мультичейн крипто-обменник с поддержкой Ethereum, Solana, TON, Tron, BSC',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}