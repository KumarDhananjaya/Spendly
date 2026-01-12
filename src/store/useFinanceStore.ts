import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export type TransactionType = 'expense' | 'earning';

export interface Transaction {
    id: string;
    amount: number;
    type: TransactionType;
    category: string;
    note: string;
    date: string;
}

interface FinanceState {
    transactions: Transaction[];
    currency: string;
    addTransaction: (transaction: Omit<Transaction, 'id' | 'date'>) => void;
    deleteTransaction: (id: string) => void;
    setCurrency: (currency: string) => void;
    getBalance: () => number;
    getExpenses: () => number;
    getEarnings: () => number;
}

export const useFinanceStore = create<FinanceState>()(
    persist(
        (set, get) => ({
            transactions: [],
            currency: '₹',
            addTransaction: (tx) => {
                const newTx: Transaction = {
                    ...tx,
                    id: Math.random().toString(36).substring(7),
                    date: new Date().toISOString(),
                };
                set((state) => ({ transactions: [newTx, ...state.transactions] }));
            },
            setCurrency: (currency) => set({ currency }),
            deleteTransaction: (id) => {
                set((state) => ({
                    transactions: state.transactions.filter((t) => t.id !== id),
                }));
            },
            getBalance: () => {
                const txs = get().transactions;
                return txs.reduce((acc, t) => acc + (t.type === 'earning' ? t.amount : -t.amount), 0);
            },
            getExpenses: () => {
                const txs = get().transactions;
                return txs.reduce((acc, t) => acc + (t.type === 'expense' ? t.amount : 0), 0);
            },
            getEarnings: () => {
                const txs = get().transactions;
                return txs.reduce((acc, t) => acc + (t.type === 'earning' ? t.amount : 0), 0);
            },
        }),
        {
            name: 'finance-storage',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);
