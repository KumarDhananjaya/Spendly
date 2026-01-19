import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export type TransactionType = 'expense' | 'earning' | 'transfer';

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
    toAccountId?: string; // Only for transfers
    note: string;
    date: string;
    isRecurring?: boolean;
}

interface FinanceState {
    transactions: Transaction[];
    accounts: Account[];
    categories: Category[];
    budgets: Budget[];
    currency: string;
    isAppLockEnabled: boolean;
    isScreenCaptureBlocked: boolean;
    addTransaction: (transaction: Omit<Transaction, 'id' | 'date'>) => void;
    updateTransaction: (id: string, transaction: Omit<Transaction, 'id' | 'date'>) => void;
    deleteTransaction: (id: string) => void;
    addAccount: (account: Omit<Account, 'id'>) => void;
    updateAccountBalance: (id: string, amount: number) => void;
    setCurrency: (currency: string) => void;
    setAppLockEnabled: (enabled: boolean) => void;
    setScreenCaptureBlocked: (blocked: boolean) => void;
    setBudget: (categoryId: string, amount: number) => void;
    getCategorySpent: (categoryId: string) => number;
    detectRecurring: () => void;
    getBalance: () => number;
    getExpenses: () => number;
    getEarnings: () => number;
    restoreData: (data: any) => void;
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
            isAppLockEnabled: false,
            isScreenCaptureBlocked: false,
            addTransaction: (tx) => {
                const newTx: Transaction = {
                    ...tx,
                    id: Math.random().toString(36).substring(7),
                    date: new Date().toISOString(),
                };

                // Update account balance
                const accounts = get().accounts.map(acc => {
                    if (acc.id === tx.accountId) {
                        // For transfers, this is the source (deduct)
                        // For earnings, add. For expenses, deduct.
                        let delta = 0;
                        if (tx.type === 'earning') delta = tx.amount;
                        else delta = -tx.amount; // expense OR transfer source
                        return { ...acc, balance: acc.balance + delta };
                    }
                    if (tx.type === 'transfer' && acc.id === tx.toAccountId) {
                        // This is the destination (add)
                        return { ...acc, balance: acc.balance + tx.amount };
                    }
                    return acc;
                });

                set((state) => ({
                    transactions: [newTx, ...state.transactions],
                    accounts
                }));
            },
            updateTransaction: (id, tx) => {
                const txs = get().transactions;
                const oldTx = txs.find(t => t.id === id);
                if (!oldTx) return;

                // 1. Revert old account balance
                let accounts = get().accounts.map(acc => {
                    if (acc.id === oldTx.accountId) {
                        let delta = 0;
                        if (oldTx.type === 'earning') delta = -oldTx.amount;
                        else delta = oldTx.amount; // revert expense OR transfer source
                        return { ...acc, balance: acc.balance + delta };
                    }
                    if (oldTx.type === 'transfer' && acc.id === oldTx.toAccountId) {
                        // revert destination (subtract)
                        return { ...acc, balance: acc.balance - oldTx.amount };
                    }
                    return acc;
                });

                // 2. Apply new account balance
                accounts = accounts.map(acc => {
                    if (acc.id === tx.accountId) {
                        let delta = 0;
                        if (tx.type === 'earning') delta = tx.amount;
                        else delta = -tx.amount; // expense OR transfer source
                        return { ...acc, balance: acc.balance + delta };
                    }
                    if (tx.type === 'transfer' && acc.id === tx.toAccountId) {
                        // Apply destination (add)
                        return { ...acc, balance: acc.balance + tx.amount };
                    }
                    return acc;
                });

                set((state) => ({
                    transactions: state.transactions.map(t => t.id === id ? { ...t, ...tx } : t),
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
            setAppLockEnabled: (enabled) => set({ isAppLockEnabled: enabled }),
            setScreenCaptureBlocked: (blocked) => set({ isScreenCaptureBlocked: blocked }),
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
            detectRecurring: () => {
                const txs = get().transactions;
                const updatedTxs = txs.map(tx => {
                    const matches = txs.filter(t =>
                        t.id !== tx.id &&
                        t.amount === tx.amount &&
                        t.categoryId === tx.categoryId &&
                        new Date(t.date).getDate() === new Date(tx.date).getDate()
                    );
                    return { ...tx, isRecurring: matches.length >= 1 };
                });
                set({ transactions: updatedTxs });
            },
            deleteTransaction: (id) => {
                const txToDelete = get().transactions.find(t => t.id === id);
                if (!txToDelete) return;

                // Revert account balance
                const accounts = get().accounts.map(acc => {
                    if (acc.id === txToDelete.accountId) {
                        let delta = 0;
                        if (txToDelete.type === 'earning') delta = -txToDelete.amount;
                        else delta = txToDelete.amount; // revert expense OR transfer source
                        return { ...acc, balance: acc.balance + delta };
                    }
                    if (txToDelete.type === 'transfer' && acc.id === txToDelete.toAccountId) {
                        // revert destination (subtract)
                        return { ...acc, balance: acc.balance - txToDelete.amount };
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
                return txs
                    .filter(t => t.type !== 'transfer')
                    .reduce((acc, t) => acc + (t.type === 'earning' ? t.amount : -t.amount), 0);
            },
            getExpenses: () => {
                const txs = get().transactions;
                return txs.reduce((acc, t) => acc + (t.type === 'expense' ? t.amount : 0), 0);
            },
            getEarnings: () => {
                const txs = get().transactions;
                return txs.reduce((acc, t) => acc + (t.type === 'earning' ? t.amount : 0), 0);
            },
            restoreData: (data) => {
                set({
                    transactions: data.transactions || [],
                    accounts: data.accounts || DEFAULT_ACCOUNTS,
                    categories: data.categories || DEFAULT_CATEGORIES,
                    budgets: data.budgets || [],
                    currency: data.currency || '₹',
                });
            },
        }),
        {
            name: 'finance-storage',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);
