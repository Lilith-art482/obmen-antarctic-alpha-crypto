'use client';
import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { FiSearch, FiExternalLink, FiRefreshCw, FiSend, FiDownload, FiClock } from 'react-icons/fi';
import { useTransactions } from '@/hooks/useTransactions';
import { useWallet } from '@/hooks/useWallet';
import { NETWORKS, SUPPORTED_TOKENS } from '@/types';
import ClientLayout from '@/components/ClientLayout';

const TYPE_CONFIG: Record<string, { icon: React.ComponentType<{size?: number; className?: string}>; label: string; color: string; bg: string }> = {
  swap: { icon: FiRefreshCw, label: 'Обмен', color: 'text-indigo-400', bg: 'bg-indigo-500/15' },
  send: { icon: FiSend, label: 'Отправка', color: 'text-orange-400', bg: 'bg-orange-500/15' },
  receive: { icon: FiDownload, label: 'Получение', color: 'text-green-400', bg: 'bg-green-500/15' },
};

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; dot: string }> = {
  success: { label: 'Успешно', color: 'text-green-400', bg: 'bg-green-500/10', dot: 'bg-green-400' },
  failed: { label: 'Ошибка', color: 'text-red-400', bg: 'bg-red-500/10', dot: 'bg-red-400' },
  pending: { label: 'В обработке', color: 'text-yellow-400', bg: 'bg-yellow-500/10', dot: 'bg-yellow-400' },
};

const TOKEN_ICONS: Record<string, string> = {};
SUPPORTED_TOKENS.forEach(t => { TOKEN_ICONS[t.symbol] = t.icon; });

function formatRelativeTime(ts: number): string {
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (mins < 1) return 'только что';
  if (mins < 60) return `${mins} мин. назад`;
  if (hours < 24) return `${hours} ч. назад`;
  if (days < 7) return `${days} д. назад`;
  return new Date(ts).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function HistoryPage() {
  const { wallet } = useWallet();
  const { transactions, loading, load } = useTransactions(wallet?.uid);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterToken, setFilterToken] = useState('');

  const filtered = useMemo(() => {
    return transactions.filter(tx => {
      const matchSearch = !search || tx.txHash?.toLowerCase().includes(search.toLowerCase());
      const matchToken = !filterToken || tx.fromToken === filterToken || tx.toToken === filterToken;
      const matchType = !filterType || tx.type === filterType;
      return matchSearch && matchToken && matchType;
    });
  }, [transactions, search, filterToken, filterType]);

  return (
    <ClientLayout>
      <div className="w-full max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">История</h1>
          <button onClick={load} className="text-gray-500 hover:text-indigo-400 transition-colors p-2 rounded-lg hover:bg-white/5">
            <FiRefreshCw size={18} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Поиск по хэшу..."
              className="w-full bg-white/5 text-white rounded-xl pl-10 pr-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500/50 focus:bg-white/10 transition-all text-sm"
            />
          </div>
          <select
            value={filterType}
            onChange={e => setFilterType(e.target.value)}
            className="bg-white/5 text-white rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500/50 text-sm appearance-none cursor-pointer min-w-[130px]"
          >
            <option value="">Все типы</option>
            <option value="swap">Обмен</option>
            <option value="send">Отправка</option>
            <option value="receive">Получение</option>
          </select>
          <select
            value={filterToken}
            onChange={e => setFilterToken(e.target.value)}
            className="bg-white/5 text-white rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500/50 text-sm appearance-none cursor-pointer min-w-[130px]"
          >
            <option value="">Все монеты</option>
            {SUPPORTED_TOKENS.map(t => <option key={t.symbol} value={t.symbol}>{t.symbol}</option>)}
          </select>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="glass rounded-2xl p-5 animate-pulse">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white/5" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-white/5 rounded w-32" />
                    <div className="h-3 bg-white/5 rounded w-48" />
                  </div>
                  <div className="h-4 bg-white/5 rounded w-20" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass rounded-2xl p-12 text-center"
          >
            <FiClock size={48} className="text-gray-600 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">
              {search || filterToken || filterType ? 'Ничего не найдено' : 'История пуста'}
            </p>
            <p className="text-gray-600 text-sm mt-1">
              {search || filterToken || filterType ? 'Попробуйте изменить параметры поиска' : 'Здесь появятся ваши транзакции'}
            </p>
          </motion.div>
        ) : (
          <div className="space-y-3">
            {filtered.map((tx, i) => {
              const typeCfg = TYPE_CONFIG[tx.type] || TYPE_CONFIG.swap;
              const statusCfg = STATUS_CONFIG[tx.status] || STATUS_CONFIG.pending;
              const TypeIcon = typeCfg.icon;
              const networkInfo = NETWORKS[tx.network];
              const fromIcon = TOKEN_ICONS[tx.fromToken] || '●';
              const toIcon = TOKEN_ICONS[tx.toToken] || '●';

              return (
                <motion.div
                  key={tx.id || i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="glass rounded-2xl p-4 sm:p-5 hover:bg-white/[0.07] transition-all"
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-10 h-10 rounded-xl ${typeCfg.bg} flex items-center justify-center flex-shrink-0`}>
                      <TypeIcon size={18} className={typeCfg.color} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-white font-semibold text-sm">{typeCfg.label}</span>
                        <span className={`px-2 py-0.5 rounded-full text-[11px] font-medium ${statusCfg.bg} ${statusCfg.color}`}>
                          <span className={`inline-block w-1.5 h-1.5 rounded-full ${statusCfg.dot} mr-1 align-middle`} />
                          {statusCfg.label}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-lg">{fromIcon}</span>
                        <span className="text-white font-bold">
                          {tx.fromAmount} {tx.fromToken}
                        </span>
                        {tx.type === 'swap' && (
                          <>
                            <span className="text-gray-600 text-sm">→</span>
                            <span className="text-lg">{toIcon}</span>
                            <span className="text-green-400 font-bold">
                              {tx.toAmount} {tx.toToken}
                            </span>
                          </>
                        )}
                      </div>

                      <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                        <span className={`px-2 py-0.5 rounded-md bg-white/5`}>
                          {networkInfo?.name || tx.network}
                        </span>
                        {tx.txHash ? (
                          <a
                            href={`${networkInfo?.explorer || '#'}${tx.txHash}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-indigo-400 hover:text-indigo-300 transition-colors"
                          >
                            {tx.txHash.slice(0, 8)}...{tx.txHash.slice(-4)}
                            <FiExternalLink size={11} />
                          </a>
                        ) : (
                          <span className="text-gray-600">—</span>
                        )}
                        <span className="text-gray-600">{formatRelativeTime(tx.timestamp)}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {filtered.length > 10 && (
          <div className="text-center pt-2">
            <button onClick={() => load()} className="text-indigo-400 hover:text-indigo-300 text-sm font-medium transition-colors">
              Загрузить еще
            </button>
          </div>
        )}
      </div>
    </ClientLayout>
  );
}
