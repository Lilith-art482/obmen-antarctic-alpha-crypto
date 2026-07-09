import { v4 as uuidv4 } from 'uuid';
import { db } from './firebase';
import { collection, addDoc, query, where, orderBy, limit, getDocs, doc, setDoc, getDoc, Timestamp } from 'firebase/firestore';
import type { Transaction, WalletData } from '@/types';

const USERS_COLLECTION = 'users';
const TRANSACTIONS_COLLECTION = 'transactions';

export async function saveTransaction(tx: Omit<Transaction, 'id' | 'timestamp'>): Promise<string> {
  try {
    const docRef = await addDoc(collection(db, TRANSACTIONS_COLLECTION), {
      ...tx,
      timestamp: Timestamp.now(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Firestore error:', error);
    return uuidv4();
  }
}

export async function getTransactions(uid: string, pageSize = 10): Promise<{ transactions: Transaction[]; total: number }> {
  try {
    const q = query(
      collection(db, TRANSACTIONS_COLLECTION),
      where('uid', '==', uid),
      orderBy('timestamp', 'desc'),
      limit(pageSize),
    );
    const snapshot = await getDocs(q);
    const transactions = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      timestamp: doc.data().timestamp?.toMillis() || Date.now(),
    })) as Transaction[];
    return { transactions, total: transactions.length };
  } catch {
    return { transactions: [], total: 0 };
  }
}

export async function saveUserWallet(wallet: WalletData): Promise<void> {
  try {
    await setDoc(doc(db, USERS_COLLECTION, wallet.uid), wallet);
  } catch (error) {
    console.error('Firestore error saving user:', error);
  }
}

export async function getUserWallet(uid: string): Promise<WalletData | null> {
  try {
    const docSnap = await getDoc(doc(db, USERS_COLLECTION, uid));
    if (docSnap.exists()) {
      return docSnap.data() as WalletData;
    }
    return null;
  } catch {
    return null;
  }
}

export { Timestamp };