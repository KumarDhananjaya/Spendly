import { Schema, model } from 'mongoose';

const categorySchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    color: { type: String, required: true },
    icon: { type: String, required: true },
});

export const Category = model('Category', categorySchema);
