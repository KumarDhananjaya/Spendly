import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export type TransactionType = 'expense' | 'earning';

export interface Account {
    id: string;
    name: string;
    type: 'bank' | 'cash' | 'upi' | 'card';
    balance: number;
    color: string;
}

export interface Category {
    id: string;
    name: string;
    icon: string;
    color: string;
    type: TransactionType;
}

export interface Budget {
    categoryId: string;
    amount: number;
    period: 'monthly';
}

export interface Transaction {
    id: string;
    amount: number;
    type: TransactionType;
    categoryId: string;
    accountId: string;
    note: string;
    date: string;
}

interface FinanceState {
    transactions: Transaction[];
    accounts: Account[];
    categories: Category[];
    budgets: Budget[];
    currency: string;
    addTransaction: (transaction: Omit<Transaction, 'id' | 'date'>) => void;
    deleteTransaction: (id: string) => void;
    addAccount: (account: Omit<Account, 'id'>) => void;
    updateAccountBalance: (id: string, amount: number) => void;
    setCurrency: (currency: string) => void;
    setBudget: (categoryId: string, amount: number) => void;
    getCategorySpent: (categoryId: string) => number;
    getBalance: () => number;
    getExpenses: () => number;
    getEarnings: () => number;
}

const DEFAULT_CATEGORIES: Category[] = [
    { id: '1', name: 'Food', icon: 'Utensils', color: '#FF9500', type: 'expense' },
    { id: '2', name: 'Transport', icon: 'Car', color: '#5856D6', type: 'expense' },
    { id: '3', name: 'Shopping', icon: 'ShoppingBag', color: '#FF2D55', type: 'expense' },
    { id: '4', name: 'Entertainment', icon: 'Gamepad2', color: '#AF52DE', type: 'expense' },
    { id: '5', name: 'Health', icon: 'Heart', color: '#FF3B30', type: 'expense' },
    { id: '6', name: 'Bills', icon: 'Receipt', color: '#007AFF', type: 'expense' },
    { id: '7', name: 'Salary', icon: 'Briefcase', color: '#34C759', type: 'earning' },
    { id: '8', name: 'Other', icon: 'MoreHorizontal', color: '#8E8E93', type: 'expense' },
];

const DEFAULT_ACCOUNTS: Account[] = [
    { id: 'main-cash', name: 'Cash Wallet', type: 'cash', balance: 0, color: '#34C759' },
];

export const useFinanceStore = create<FinanceState>()(
    persist(
        (set, get) => ({
            transactions: [],
            accounts: DEFAULT_ACCOUNTS,
            categories: DEFAULT_CATEGORIES,
            budgets: [],
            currency: '₹',
            addTransaction: (tx) => {
                const newTx: Transaction = {
                    ...tx,
                    id: Math.random().toString(36).substring(7),
                    date: new Date().toISOString(),
                };

                // Update account balance
                const accounts = get().accounts.map(acc => {
                    if (acc.id === tx.accountId) {
                        return {
                            ...acc,
                            balance: acc.balance + (tx.type === 'earning' ? tx.amount : -tx.amount)
                        };
                    }
                    return acc;
                });

                set((state) => ({
                    transactions: [newTx, ...state.transactions],
                    accounts
                }));
            },
            addAccount: (acc) => {
                const newAcc: Account = {
                    ...acc,
                    id: Math.random().toString(36).substring(7),
                };
                set((state) => ({ accounts: [...state.accounts, newAcc] }));
            },
            updateAccountBalance: (id, amount) => {
                set((state) => ({
                    accounts: state.accounts.map(acc =>
                        acc.id === id ? { ...acc, balance: acc.balance + amount } : acc
                    )
                }));
            },
            setCurrency: (currency) => set({ currency }),
            setBudget: (categoryId, amount) => {
                set((state) => {
                    const existing = state.budgets.find(b => b.categoryId === categoryId);
                    if (existing) {
                        return {
                            budgets: state.budgets.map(b => b.categoryId === categoryId ? { ...b, amount } : b)
                        };
                    }
                    return {
                        budgets: [...state.budgets, { categoryId, amount, period: 'monthly' }]
                    };
                });
            },
            getCategorySpent: (categoryId) => {
                const now = new Date();
                return get().transactions
                    .filter(t => t.categoryId === categoryId &&
                        new Date(t.date).getMonth() === now.getMonth() &&
                        new Date(t.date).getFullYear() === now.getFullYear())
                    .reduce((acc, t) => acc + t.amount, 0);
            },
            deleteTransaction: (id) => {
                const txToDelete = get().transactions.find(t => t.id === id);
                if (!txToDelete) return;

                // Revert account balance
                const accounts = get().accounts.map(acc => {
                    if (acc.id === txToDelete.accountId) {
                        return {
                            ...acc,
                            balance: acc.balance - (txToDelete.type === 'earning' ? txToDelete.amount : -txToDelete.amount)
                        };
                    }
                    return acc;
                });

                set((state) => ({
                    transactions: state.transactions.filter((t) => t.id !== id),
                    accounts
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
