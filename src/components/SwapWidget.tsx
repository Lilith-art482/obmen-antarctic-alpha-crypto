'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiArrowDown } from 'react-icons/fi';
import { SUPPORTED_TOKENS } from '@/types';
import type { TokenInfo, NetworkType } from '@/types';
import { useWallet } from '@/hooks/useWallet';
import { useCryptoBalance } from '@/hooks/useCryptoBalance';
import { usePrices } from '@/hooks/usePrice';
import toast from 'react-hot-toast';
import { NetworkChip } from './NetworkChip';
import { TokenSelect } from './TokenSelect';

const USDT_NETWORKS: { id: NetworkType; label: string }[] = [
  { id: 'ton', label: 'TON' },
  { id: 'tron', label: 'TRC-20' },
  { id: 'solana', label: 'Solana' },
];

export function SwapWidget() {
  const { wallet, getAddress } = useWallet();
  const { getPrice } = usePrices();
  const [fromToken, setFromToken] = useState<TokenInfo>(SUPPORTED_TOKENS[0]);
  const [toToken, setToToken] = useState<TokenInfo>(SUPPORTED_TOKENS[1]);
  const [fromAmount, setFromAmount] = useState('');
  const [toAmount, setToAmount] = useState('');
  const [usdtNetwork, setUsdtNetwork] = useState<NetworkType>('ton');
  const [swapping, setSwapping] = useState(false);

  const fromNetworks = fromToken.symbol === 'USDT' ? [usdtNetwork] : fromToken.networks;
  const toNetworks = toToken.symbol === 'USDT' ? [usdtNetwork] : toToken.networks;

  const address = wallet ? getAddress(fromNetworks[0]) : '';
  const uniqueNetworks = fromNetworks.concat(toNetworks.filter(n => !fromNetworks.includes(n)));
  const { getBalance } = useCryptoBalance(address, uniqueNetworks);

  useEffect(() => {
    if (fromAmount && parseFloat(fromAmount) > 0) {
      const fromPrice = getPrice(fromToken.symbol);
      const toPrice = getPrice(toToken.symbol);
      if (fromPrice && toPrice) {
        const result = (parseFloat(fromAmount) * fromPrice) / toPrice;
        setToAmount(result.toFixed(6));
      } else {
        setToAmount((parseFloat(fromAmount) * 0.98).toFixed(6));
      }
    } else {
      setToAmount('');
    }
  }, [fromAmount, fromToken, toToken, getPrice]);

  function handleSwap() {
    const tmpToken = fromToken;
    const tmpAmount = fromAmount;
    setFromToken(toToken);
    setToToken(tmpToken);
    setFromAmount(toAmount);
    setToAmount(tmpAmount);
  }

  const fromBalance = getBalance(fromNetworks[0], fromToken.symbol);
  const toBalance = getBalance(toNetworks[0], toToken.symbol);

  const networkFee = fromNetworks[0] === 'ethereum' ? 0.005 : fromNetworks[0] === 'solana' ? 0.000005 : fromNetworks[0] === 'ton' ? 0.01 : fromNetworks[0] === 'tron' ? 0.1 : 0.0005;

  async function executeSwap() {
    if (!wallet || !fromAmount) return;
    setSwapping(true);
    try {
      const amount = parseFloat(fromAmount);
      if (amount > fromBalance) {
        toast.error('Недостаточно средств');
        return;
      }
      toast.success(`Обмен ${fromAmount} ${fromToken.symbol} на ${toAmount} ${toToken.symbol} выполнен (симуляция)`);
      setFromAmount('');
      setToAmount('');
    } catch {
      toast.error('Ошибка обмена');
    } finally {
      setSwapping(false);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass p-6 rounded-2xl w-full max-w-md mx-auto"
    >
      <h2 className="text-xl font-bold text-white mb-6">Обмен</h2>

      <div className="space-y-4">
        <div className="glass-input p-4 rounded-xl">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-400">Вы отдаете</span>
            <span className="text-xs text-gray-500">
              Баланс: <span className="text-accent">{fromBalance.toFixed(4)}</span>
            </span>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="number"
              value={fromAmount}
              onChange={e => setFromAmount(e.target.value)}
              placeholder="0.00"
              className="flex-1 bg-transparent text-2xl text-white outline-none placeholder-gray-600"
            />
            <TokenSelect token={fromToken} onSelect={setFromToken} />
          </div>
          {fromToken.symbol === 'USDT' && (
            <div className="flex gap-2 mt-3">
              {USDT_NETWORKS.map(n => (
                <NetworkChip key={n.id} active={usdtNetwork === n.id} onClick={() => setUsdtNetwork(n.id)} label={n.label} />
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-center -my-2 relative z-10">
          <motion.button
            whileHover={{ scale: 1.1, rotate: 180 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleSwap}
            className="bg-accent p-3 rounded-full shadow-lg shadow-accent/30"
          >
            <FiArrowDown className="text-white text-lg" />
          </motion.button>
        </div>

        <div className="glass-input p-4 rounded-xl">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-400">Вы получаете</span>
            <span className="text-xs text-gray-500">
              Баланс: <span className="text-accent">{toBalance.toFixed(4)}</span>
            </span>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="number"
              value={toAmount}
              readOnly
              placeholder="0.00"
              className="flex-1 bg-transparent text-2xl text-white outline-none placeholder-gray-600"
            />
            <TokenSelect token={toToken} onSelect={setToToken} />
          </div>
          {toToken.symbol === 'USDT' && (
            <div className="flex gap-2 mt-3">
              {USDT_NETWORKS.map(n => (
                <NetworkChip key={n.id} active={usdtNetwork === n.id} onClick={() => setUsdtNetwork(n.id)} label={n.label} />
              ))}
            </div>
          )}
        </div>

        <div className="text-xs text-gray-500 space-y-1 pt-2">
          <div className="flex justify-between">
            <span>Вы получите ~</span>
            <span className="text-white">{toAmount || '0.00'} {toToken.symbol}</span>
          </div>
          <div className="flex justify-between">
            <span>Комиссия сети</span>
            <span className="text-accent">{networkFee} {fromToken.symbol}</span>
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={executeSwap}
          disabled={!fromAmount || swapping}
          className="w-full py-4 rounded-xl font-bold text-white bg-gradient-to-r from-accent to-accent-dark hover:from-accent hover:to-accent-dark disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-lg shadow-accent/25"
        >
          {swapping ? 'Обмен...' : 'Обменять'}
        </motion.button>
      </div>
    </motion.div>
  );
}