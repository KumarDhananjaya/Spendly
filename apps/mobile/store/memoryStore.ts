import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Expense, Category, Budget, ChangeEvent } from '@splendly/types';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';

interface FinanceState {
    expenses: Expense[];
    categories: Category[];
    budgets: Budget[];
    syncQueue: ChangeEvent[];
    lastSyncAt: number;
    userId: string | null;
    token: string | null;

    setAuth: (userId: string, token: string) => void;
    clearAuth: () => void;

    addExpense: (expense: Omit<Expense, 'id' | 'clientId' | 'userId' | 'updatedAt'>) => void;
    updateExpense: (clientId: string, updates: Partial<Expense>) => void;
    deleteExpense: (clientId: string) => void;

    addToSyncQueue: (event: Omit<ChangeEvent, 'timestamp'>) => void;
    clearSyncQueue: (processedIds: string[]) => void;
    setLastSyncAt: (timestamp: number) => void;
    syncWithServer: (serverChanges: ChangeEvent[]) => void;
}

export const useFinanceStore = create<FinanceState>()(
    persist(
        (set, get) => ({
            expenses: [],
            categories: [],
            budgets: [],
            syncQueue: [],
            lastSyncAt: 0,
            userId: null,
            token: null,

            setAuth: (userId, token) => set({ userId, token }),
            clearAuth: () => set({ userId: null, token: null, expenses: [], syncQueue: [] }),

            addExpense: (data) => {
                const { userId, addToSyncQueue } = get();
                if (!userId) return;

                const clientId = uuidv4();
                const timestamp = Date.now();
                const newExpense: Expense = {
                    ...data,
                    clientId,
                    userId,
                    spentAt: data.spentAt || timestamp,
                    updatedAt: timestamp,
                };

                set((state) => ({
                    expenses: [newExpense, ...state.expenses],
                }));

                addToSyncQueue({
                    id: uuidv4(),
                    entity: 'expense',
                    action: 'create',
                    payload: newExpense,
                });
            },

            updateExpense: (clientId, updates) => {
                const timestamp = Date.now();
                set((state) => ({
                    expenses: state.expenses.map((e) =>
                        e.clientId === clientId ? { ...e, ...updates, updatedAt: timestamp } : e
                    ),
                }));

                const updatedExpense = get().expenses.find((e) => e.clientId === clientId);
                if (updatedExpense) {
                    get().addToSyncQueue({
                        id: uuidv4(),
                        entity: 'expense',
                        action: 'update',
                        payload: updatedExpense,
                    });
                }
            },

            deleteExpense: (clientId) => {
                set((state) => ({
                    expenses: state.expenses.filter((e) => e.clientId !== clientId),
                }));

                get().addToSyncQueue({
                    id: uuidv4(),
                    entity: 'expense',
                    action: 'delete',
                    payload: { clientId },
                });
            },

            addToSyncQueue: (event) => {
                set((state) => ({
                    syncQueue: [...state.syncQueue, { ...event, timestamp: Date.now() }],
                }));
            },

            clearSyncQueue: (processedIds) => {
                set((state) => ({
                    syncQueue: state.syncQueue.filter((q) => !processedIds.includes(q.id)),
                }));
            },

            setLastSyncAt: (timestamp) => set({ lastSyncAt: timestamp }),

            syncWithServer: (serverChanges) => {
                set((state) => {
                    let updatedExpenses = [...state.expenses];

                    for (const change of serverChanges) {
                        if (change.entity === 'expense') {
                            const payload = change.payload as Expense;
                            if (change.action === 'create' || change.action === 'update') {
                                const index = updatedExpenses.findIndex((e) => e.clientId === payload.clientId);
                                if (index > -1) {
                                    // Only update if server is newer (though Last Write Wins usually handles this at server)
                                    updatedExpenses[index] = { ...updatedExpenses[index], ...payload };
                                } else {
                                    updatedExpenses.push(payload);
                                }
                            } else if (change.action === 'delete') {
                                updatedExpenses = updatedExpenses.filter((e) => e.clientId !== payload.clientId);
                            }
                        }
                    }

                    return { expenses: updatedExpenses };
                });
            },
        }),
        {
            name: 'splendly-finance-storage',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);
