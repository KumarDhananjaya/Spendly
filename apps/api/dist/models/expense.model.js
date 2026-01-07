"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Expense = void 0;
const mongoose_1 = require("mongoose");
const expenseSchema = new mongoose_1.Schema({
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    clientId: { type: String, required: true }, // Local ID from mobile app
    amount: { type: Number, required: true },
    categoryId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Category', required: true },
    note: { type: String },
    source: { type: String, enum: ['MANUAL', 'UPI', 'SMS'], default: 'MANUAL' },
    spentAt: { type: Date, required: true },
    updatedAt: { type: Date, default: Date.now },
});
// Compound index for userId and clientId to ensure uniqueness of synced records
expenseSchema.index({ userId: 1, clientId: 1 }, { unique: true });
exports.Expense = (0, mongoose_1.model)('Expense', expenseSchema);
