'use client';
import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import type { ThemeType, LanguageType, ColorSchemeType } from '@/types';

interface ThemeContextType {
  theme: ThemeType;
  language: LanguageType;
  colorScheme: ColorSchemeType;
  setTheme: (t: ThemeType) => void;
  setLanguage: (l: LanguageType) => void;
  setColorScheme: (c: ColorSchemeType) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'dark',
  language: 'ru',
  colorScheme: 'purple',
  setTheme: () => {},
  setLanguage: () => {},
  setColorScheme: () => {},
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemeType>('dark');
  const [language, setLanguageState] = useState<LanguageType>('ru');
  const [colorScheme, setColorSchemeState] = useState<ColorSchemeType>('purple');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as ThemeType | null;
    const savedLang = localStorage.getItem('language') as LanguageType | null;
    const savedColor = localStorage.getItem('colorScheme') as ColorSchemeType | null;
    if (savedTheme) setThemeState(savedTheme);
    if (savedLang) setLanguageState(savedLang);
    if (savedColor) setColorSchemeState(savedColor);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    document.documentElement.setAttribute('data-accent', colorScheme);
    localStorage.setItem('colorScheme', colorScheme);
  }, [colorScheme]);

  const setTheme = useCallback((t: ThemeType) => setThemeState(t), []);
  const setLanguage = useCallback((l: LanguageType) => {
    setLanguageState(l);
    localStorage.setItem('language', l);
  }, []);
  const setColorScheme = useCallback((c: ColorSchemeType) => setColorSchemeState(c), []);

  return (
    <ThemeContext.Provider value={{ theme, language, colorScheme, setTheme, setLanguage, setColorScheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}

export const LANG: Record<LanguageType, Record<string, string>> = {
  ru: {
    exchange: 'Обмен',
    wallet: 'Кошелек',
    history: 'История',
    profile: 'Профиль',
    settings: 'Настройки',
    logout: 'Выйти',
    you_give: 'Вы отдаете',
    you_get: 'Вы получаете',
    balance: 'Баланс',
    network_fee: 'Комиссия сети',
    exchange_btn: 'Обменять',
    exchange_btn_progress: 'Обмен...',
    send: 'Отправить',
    receive: 'Получить',
    all_assets: 'Все активы',
    price: 'Цена',
    change_24h: '24ч',
    theme: 'Тема',
    language: 'Язык',
    dark: 'Темная',
    light: 'Светлая',
    profile_title: 'Мой профиль',
    wallet_address: 'Адрес кошелька',
    settings_title: 'Настройки',
    color_scheme: 'Цветовая гамма',
    coming_soon: 'Скоро',
    accent_color: 'Цвет акцента',
  },
  en: {
    exchange: 'Exchange',
    wallet: 'Wallet',
    history: 'History',
    profile: 'Profile',
    settings: 'Settings',
    logout: 'Logout',
    you_give: 'You give',
    you_get: 'You receive',
    balance: 'Balance',
    network_fee: 'Network fee',
    exchange_btn: 'Exchange',
    exchange_btn_progress: 'Exchanging...',
    send: 'Send',
    receive: 'Receive',
    all_assets: 'All Assets',
    price: 'Price',
    change_24h: '24h',
    theme: 'Theme',
    language: 'Language',
    dark: 'Dark',
    light: 'Light',
    profile_title: 'My Profile',
    wallet_address: 'Wallet Address',
    settings_title: 'Settings',
    color_scheme: 'Color Scheme',
    coming_soon: 'Coming Soon',
    accent_color: 'Accent Color',
  },
  zh: {
    exchange: '交换',
    wallet: '钱包',
    history: '历史',
    profile: '个人资料',
    settings: '设置',
    logout: '退出',
    you_give: '您提供',
    you_get: '您收到',
    balance: '余额',
    network_fee: '网络费用',
    exchange_btn: '交换',
    exchange_btn_progress: '交换中...',
    send: '发送',
    receive: '接收',
    all_assets: '所有资产',
    price: '价格',
    change_24h: '24小时',
    theme: '主题',
    language: '语言',
    dark: '深色',
    light: '浅色',
    profile_title: '我的资料',
    wallet_address: '钱包地址',
    settings_title: '设置',
    color_scheme: '配色方案',
    coming_soon: '即将推出',
    accent_color: '强调色',
  },
};
