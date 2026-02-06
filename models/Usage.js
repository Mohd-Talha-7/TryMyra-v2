import mongoose from 'mongoose';

const usageSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    id: { type: String, required: true, unique: true },
    date: { type: String, required: true },
    description: { type: String, required: true },
    amount: { type: Number, required: true }, // Negative value
    status: { type: String, default: 'Completed' }, // Completed status
    category: { type: String, required: true }, // IMAGE, UGC, VFX, NO HUMAN
    adType: { type: String }, // Additional ad type info
    createdAt: { type: Date, default: Date.now }
});

export const Usage = mongoose.model('Usage', usageSchema);
