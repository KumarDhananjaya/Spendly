"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.expenseController = void 0;
const expense_model_1 = require("../models/expense.model");
exports.expenseController = {
    list: async (request) => {
        const userId = request.user.id;
        return await expense_model_1.Expense.find({ userId }).sort({ spentAt: -1 });
    },
    create: async (request, reply) => {
        const userId = request.user.id;
        const body = request.body;
        // Basic validation
        if (!body.amount || !body.categoryId) {
            return reply.status(400).send({ message: 'Missing required fields' });
        }
        const expense = new expense_model_1.Expense({ ...body, userId });
        await expense.save();
        return expense;
    },
};
