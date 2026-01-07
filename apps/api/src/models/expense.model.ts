import { Schema, model, Types } from 'mongoose';

const expenseSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    clientId: { type: String, required: true }, // Local ID from mobile app
    amount: { type: Number, required: true },
    categoryId: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    note: { type: String },
    source: { type: String, enum: ['MANUAL', 'UPI', 'SMS'], default: 'MANUAL' },
    spentAt: { type: Date, required: true },
    updatedAt: { type: Date, default: Date.now },
});

// Compound index for userId and clientId to ensure uniqueness of synced records
expenseSchema.index({ userId: 1, clientId: 1 }, { unique: true });

export const Expense = model('Expense', expenseSchema);
