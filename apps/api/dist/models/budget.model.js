"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Budget = void 0;
const mongoose_1 = require("mongoose");
const budgetSchema = new mongoose_1.Schema({
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    categoryId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Category', required: true },
    month: { type: String, required: true }, // YYYY-MM
    limit: { type: Number, required: true },
});
budgetSchema.index({ userId: 1, categoryId: 1, month: 1 }, { unique: true });
exports.Budget = (0, mongoose_1.model)('Budget', budgetSchema);
