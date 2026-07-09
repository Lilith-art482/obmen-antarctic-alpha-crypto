'use client';
import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { FiSearch, FiExternalLink, FiCheckCircle, FiX, FiClock } from 'react-icons/fi';
import { useTransactions } from '@/hooks/useTransactions';
import { useWallet } from '@/hooks/useWallet';
import { NETWORKS, SUPPORTED_TOKENS } from '@/types';
import ClientLayout from '@/components/ClientLayout';

const STATUS_ICONS: Record<string, React.ComponentType<{size?: number}>> = {
  success: FiCheckCircle,
  failed: FiX,
  pending: FiClock,
};

const STATUS_COLORS: Record<string, string> = {
  success: 'text-green-400',
  failed: 'text-red-400',
  pending: 'text-yellow-400',
};

export default function HistoryPage() {
  const { wallet } = useWallet();
  const { transactions, loading, load } = useTransactions(wallet?.uid);
  const [search, setSearch] = useState('');
  const [filterToken, setFilterToken] = useState('');

  const filtered = useMemo(() => {
    return transactions.filter(tx => {
      const matchSearch = !search || tx.txHash?.toLowerCase().includes(search.toLowerCase());
      const matchToken = !filterToken || tx.fromToken === filterToken || tx.toToken === filterToken;
      return matchSearch && matchToken;
    });
  }, [transactions, search, filterToken]);

  return (
    <ClientLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-white">История транзакций</h1>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Поиск по хэшу..."
              className="w-full bg-white/10 text-white rounded-xl pl-10 pr-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <select
            value={filterToken}
            onChange={e => setFilterToken(e.target.value)}
            className="bg-white/10 text-white rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">Все монеты</option>
            {SUPPORTED_TOKENS.map(t => <option key={t.symbol} value={t.symbol}>{t.symbol}</option>)}
          </select>
        </div>

        <div className="glass rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left px-4 py-3 text-gray-400 font-medium">Тип</th>
                  <th className="text-left px-4 py-3 text-gray-400 font-medium">Сумма</th>
                  <th className="text-left px-4 py-3 text-gray-400 font-medium">Сеть</th>
                  <th className="text-left px-4 py-3 text-gray-400 font-medium">Хэш</th>
                  <th className="text-left px-4 py-3 text-gray-400 font-medium">Статус</th>
                  <th className="text-left px-4 py-3 text-gray-400 font-medium">Дата</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={6} className="text-center py-8">
                    <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto" />
                  </td></tr>
                ) : filtered.length === 0 ? (
                  <tr><td colSpan={6} className="text-center py-8 text-gray-500">
                    {search || filterToken ? 'Ничего не найдено' : 'История пуста'}
                  </td></tr>
                ) : (
                  filtered.slice(0, 10).map((tx, i) => {
                    const StatusIcon = STATUS_ICONS[tx.status];
                    const networkInfo = NETWORKS[tx.network];
                    return (
                      <motion.tr
                        key={tx.id || i}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: i * 0.05 }}
                        className="border-b border-white/5 hover:bg-white/5 transition-colors"
                      >
                        <td className="px-4 py-3 text-white capitalize">{tx.type}</td>
                        <td className="px-4 py-3">
                          <span className="text-white">{tx.fromAmount} {tx.fromToken}</span>
                          <span className="text-gray-500 mx-1">→</span>
                          <span className="text-green-400">{tx.toAmount} {tx.toToken}</span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-gray-400 text-xs">{networkInfo?.name || tx.network}</span>
                        </td>
                        <td className="px-4 py-3">
                          {tx.txHash ? (
                            <a
                              href={`${networkInfo?.explorer || '#'}${tx.txHash}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1 text-indigo-400 hover:text-indigo-300"
                            >
                              {tx.txHash.slice(0, 8)}...
                              <FiExternalLink size={12} />
                            </a>
                          ) : (
                            <span className="text-gray-600">—</span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <div className={`flex items-center gap-1 ${STATUS_COLORS[tx.status]}`}>
                            <StatusIcon size={14} />
                            <span className="text-xs capitalize">{tx.status === 'pending' ? 'В обработке' : tx.status === 'success' ? 'Успешно' : 'Ошибка'}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-gray-400 text-xs">
                          {new Date(tx.timestamp).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                        </td>
                      </motion.tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {filtered.length > 10 && (
          <div className="text-center">
            <button onClick={() => load()} className="text-indigo-400 hover:text-indigo-300 text-sm">
              Загрузить еще
            </button>
          </div>
        )}
      </div>
    </ClientLayout>
  );
}