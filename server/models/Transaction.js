import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    id: { type: String, required: true, unique: true },
    date: { type: String, required: true },
    description: { type: String, required: true },
    amount: { type: Number, required: true }, // Positive value (credit addition)
    amountINR: { type: Number },
    status: { type: String, required: true },
    paymentMethod: { type: String }, // Razorpay, etc.
    createdAt: { type: Date, default: Date.now }
});

export const Transaction = mongoose.model('Transaction', transactionSchema);
