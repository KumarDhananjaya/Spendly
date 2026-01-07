import { Schema, model } from 'mongoose';

const budgetSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    categoryId: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    month: { type: String, required: true }, // YYYY-MM
    limit: { type: Number, required: true },
});

budgetSchema.index({ userId: 1, categoryId: 1, month: 1 }, { unique: true });

export const Budget = model('Budget', budgetSchema);
