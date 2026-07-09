'use client';
import { useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { ethers } from 'ethers';
import type { WalletData, NetworkType } from '@/types';
import { saveUserWallet } from '@/lib/firestore';

const WALLET_KEY = 'crypto_wallet';
const PIN_KEY = 'crypto_pin';
const MNEMONIC_SHOWN_KEY = 'mnemonic_shown';

function decrypt(encrypted: string, pin: string): string {
  const decoded = encrypted.split('').map((c, i) => String.fromCharCode(c.charCodeAt(0) ^ pin.charCodeAt(i % pin.length))).join('');
  return Buffer.from(decoded, 'base64').toString('utf-8');
}

function encryptWallet(text: string, pin: string): string {
  const encoded = Buffer.from(text).toString('base64');
  return encoded.split('').map((c, i) => String.fromCharCode(c.charCodeAt(0) ^ pin.charCodeAt(i % pin.length))).join('');
}

export function useWallet() {
  const [wallet, setWallet] = useState<WalletData | null>(null);
  const [loading, setLoading] = useState(true);
  const [mnemonic, setMnemonic] = useState<string | null>(null);
  const [pin, setPin_] = useState<string | null>(null);
  const [mnemonicShown, setMnemonicShown] = useState(false);

  useEffect(() => {
    const saved = sessionStorage.getItem(WALLET_KEY);
    const savedPin = sessionStorage.getItem(PIN_KEY);
    const shown = localStorage.getItem(MNEMONIC_SHOWN_KEY);

    if (saved && savedPin) {
      try {
        const decryptedMnemonic = decrypt(saved, savedPin);
        const mnemonicWallet = ethers.Wallet.fromPhrase(decryptedMnemonic);
        const addresses: Record<string, string> = {};
        const networks: NetworkType[] = ['ethereum', 'solana', 'ton', 'tron', 'bsc'];
        const ethAddr = mnemonicWallet.address;

        networks.forEach(n => {
          if (n === 'ethereum') addresses[n] = ethAddr;
          else {
            const hdNode = ethers.HDNodeWallet.fromPhrase(decryptedMnemonic);
            const child = hdNode.derivePath(`m/44'/${n === 'solana' ? 501 : n === 'ton' ? 607 : n === 'tron' ? 195 : 60}'/0'/0/0`);
            addresses[n] = child.address;
          }
        });

        setWallet({
          addresses,
          uid: uuidv4(),
          createdAt: Date.now(),
        });
        setPin_(savedPin);
        setMnemonic(decryptedMnemonic);
        setMnemonicShown(!!shown);
      } catch {
        createNewWallet();
      }
    } else {
      createNewWallet();
    }
    setLoading(false);
  }, []);

  function createNewWallet() {
    const randomWallet = ethers.Wallet.createRandom();
    const mnemonicPhrase = randomWallet.mnemonic?.phrase || '';
    const addresses: Record<string, string> = {};
    const networks: NetworkType[] = ['ethereum', 'solana', 'ton', 'tron', 'bsc'];
    addresses['ethereum'] = randomWallet.address;
    networks.filter(n => n !== 'ethereum').forEach(n => {
      addresses[n] = ethers.Wallet.createRandom().address;
    });

    setMnemonic(mnemonicPhrase);
    setWallet({
      addresses,
      uid: uuidv4(),
      createdAt: Date.now(),
    });
  }

  const setPin = useCallback((newPin: string) => {
    if (!wallet || !mnemonic) return;
    const encrypted = encryptWallet(mnemonic, newPin);
    sessionStorage.setItem(WALLET_KEY, encrypted);
    sessionStorage.setItem(PIN_KEY, newPin);
    setPin_(newPin);
    saveUserWallet({ ...wallet, pin: newPin });
  }, [wallet, mnemonic]);

  const verifyPin = useCallback((inputPin: string): boolean => {
    return pin === inputPin;
  }, [pin]);

  const markMnemonicShown = useCallback(() => {
    localStorage.setItem(MNEMONIC_SHOWN_KEY, 'true');
    setMnemonicShown(true);
  }, []);

  const clearWallet = useCallback(() => {
    sessionStorage.removeItem(WALLET_KEY);
    sessionStorage.removeItem(PIN_KEY);
    setWallet(null);
    setMnemonic(null);
    setPin_(null);
  }, []);

  return {
    wallet,
    loading,
    mnemonic,
    pin,
    mnemonicShown,
    setPin,
    verifyPin,
    markMnemonicShown,
    clearWallet,
    getAddress: (network: NetworkType) => wallet?.addresses[network] || '',
  };
}