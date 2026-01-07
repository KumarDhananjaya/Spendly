"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.syncController = void 0;
const expense_model_1 = require("../models/expense.model");
const category_model_1 = require("../models/category.model");
const budget_model_1 = require("../models/budget.model");
exports.syncController = {
    sync: async (request, reply) => {
        const { lastSyncAt, changes } = request.body;
        const userId = request.user.id;
        const serverChanges = [];
        // 1. Process incoming changes from client (Last Write Wins)
        for (const change of changes) {
            const { entity, action, payload, timestamp } = change;
            try {
                if (entity === 'expense') {
                    if (action === 'create' || action === 'update') {
                        await expense_model_1.Expense.findOneAndUpdate({ userId, clientId: payload.clientId }, { ...payload, userId, updatedAt: new Date(timestamp) }, { upsert: true, new: true });
                    }
                    else if (action === 'delete') {
                        await expense_model_1.Expense.deleteOne({ userId, clientId: payload.clientId });
                    }
                }
                else if (entity === 'category') {
                    if (action === 'create' || action === 'update') {
                        await category_model_1.Category.findOneAndUpdate({ userId, name: payload.name }, { ...payload, userId }, { upsert: true, new: true });
                    }
                    else if (action === 'delete') {
                        await category_model_1.Category.deleteOne({ userId, _id: payload.id });
                    }
                }
                else if (entity === 'budget') {
                    if (action === 'create' || action === 'update') {
                        await budget_model_1.Budget.findOneAndUpdate({ userId, categoryId: payload.categoryId, month: payload.month }, { ...payload, userId }, { upsert: true, new: true });
                    }
                    else if (action === 'delete') {
                        await budget_model_1.Budget.deleteOne({ userId, _id: payload.id });
                    }
                }
            }
            catch (error) {
                request.log.error(`Error syncing ${entity} ${action}:`, error);
            }
        }
        // 2. Fetch changes from server that happened after lastSyncAt
        // Simplified: return all data if lastSyncAt is 0, else return updates since then
        const lastSyncDate = new Date(lastSyncAt);
        const expenses = await expense_model_1.Expense.find({ userId, updatedAt: { $gt: lastSyncDate } });
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
