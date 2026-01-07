import { Expense } from '../models/expense.model';
import { Category } from '../models/category.model';
import { Budget } from '../models/budget.model';
import { ChangeEvent } from '@splendly/types';

export const syncController = {
    sync: async (request: any, reply: any) => {
        const { lastSyncAt, changes } = request.body as { lastSyncAt: number; changes: ChangeEvent[] };
        const userId = request.user.id;

        const serverChanges: ChangeEvent[] = [];

        // 1. Process incoming changes from client (Last Write Wins)
        for (const change of changes) {
            const { entity, action, payload, timestamp } = change;

            try {
                if (entity === 'expense') {
                    if (action === 'create' || action === 'update') {
                        await Expense.findOneAndUpdate(
                            { userId, clientId: payload.clientId },
                            { ...payload, userId, updatedAt: new Date(timestamp) },
                            { upsert: true, new: true }
                        );
                    } else if (action === 'delete') {
                        await Expense.deleteOne({ userId, clientId: payload.clientId });
                    }
                } else if (entity === 'category') {
                    if (action === 'create' || action === 'update') {
                        await Category.findOneAndUpdate(
                            { userId, name: payload.name },
                            { ...payload, userId },
                            { upsert: true, new: true }
                        );
                    } else if (action === 'delete') {
                        await Category.deleteOne({ userId, _id: payload.id });
                    }
                } else if (entity === 'budget') {
                    if (action === 'create' || action === 'update') {
                        await Budget.findOneAndUpdate(
                            { userId, categoryId: payload.categoryId, month: payload.month },
                            { ...payload, userId },
                            { upsert: true, new: true }
                        );
                    } else if (action === 'delete') {
                        await Budget.deleteOne({ userId, _id: payload.id });
                    }
                }
            } catch (error) {
                request.log.error(`Error syncing ${entity} ${action}:`, error);
            }
        }

        // 2. Fetch changes from server that happened after lastSyncAt
        // Simplified: return all data if lastSyncAt is 0, else return updates since then
        const lastSyncDate = new Date(lastSyncAt);

        const expenses = await Expense.find({ userId, updatedAt: { $gt: lastSyncDate } });
        expenses.forEach(exp => {
            serverChanges.push({
                id: exp._id.toString(),
                entity: 'expense',
                action: 'update',
                payload: exp,
                timestamp: exp.updatedAt.getTime(),
            });
        });

        // In a real production app, we would track deletions and category/budget updates similarly.
        // For this implementation, we focus on the primary expense sync.

        return {
            lastSyncAt: Date.now(),
            changes: serverChanges,
        };
    },
};
