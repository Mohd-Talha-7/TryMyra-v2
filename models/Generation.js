import mongoose from 'mongoose';

const generationSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    id: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    type: { type: String, required: true },
    status: { type: String, default: 'Ready' },
    imageUrl: { type: String, required: true },
    content: { type: String },
    platform: { type: String },
    adType: { type: String },
    category: { type: String },
    createdAt: { type: Number, required: true }
});

export const Generation = mongoose.model('Generation', generationSchema);
