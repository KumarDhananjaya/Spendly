import { Expense } from '../models/expense.model';
import { z } from 'zod';

export const expenseController = {
    list: async (request: any) => {
        const userId = request.user.id;
        return await Expense.find({ userId }).sort({ spentAt: -1 });
    },

    create: async (request: any, reply: any) => {
        const userId = request.user.id;
        const body = request.body;
        // Basic validation
        if (!body.amount || !body.categoryId) {
            return reply.status(400).send({ message: 'Missing required fields' });
        }
        const expense = new Expense({ ...body, userId });
        await expense.save();
        return expense;
    },
};
