import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { Generation } from './models/Generation.js';
import { Transaction } from './models/Transaction.js';
import { Usage } from './models/Usage.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../.env') });

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
    origin: [
        'http://localhost:5173',
        'http://localhost:5174',
        /https:\/\/.*\.vercel\.app$/
    ],
    credentials: true
}));
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.ATLASDB_URL)
    .then(() => {
        console.log(`Connected to MongoDB Atlas - Database: ${mongoose.connection.name}`);
    })
    .catch(err => console.error('MongoDB connection error:', err));

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', database: mongoose.connection.name, connected: mongoose.connection.readyState === 1 });
});

// --- GENERATIONS ROUTES ---

app.get('/api/generations/:userId', async (req, res) => {
    try {
        const generations = await Generation.find({ userId: req.params.userId }).sort({ createdAt: -1 });
        res.json(generations);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/generations', async (req, res) => {
    try {
        console.log('Saving generation:', req.body);
        const newGen = new Generation(req.body);
        await newGen.save();
        console.log('Generation saved successfully');
        res.status(201).json(newGen);
    } catch (err) {
        console.error('Error saving generation:', err.message);
        res.status(400).json({ error: err.message });
    }
});

app.delete('/api/generations/:id', async (req, res) => {
    try {
        await Generation.findOneAndDelete({ id: req.params.id });
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/api/generations/user/:userId', async (req, res) => {
    try {
        await Generation.deleteMany({ userId: req.params.userId });
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- TRANSACTIONS ROUTES ---

app.get('/api/transactions/:userId', async (req, res) => {
    try {
        const transactions = await Transaction.find({ userId: req.params.userId }).sort({ createdAt: -1 });
        res.json(transactions);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/transactions', async (req, res) => {
    try {
        console.log('Saving transaction:', req.body);
        const newTx = new Transaction(req.body);
        await newTx.save();
        console.log('Transaction saved successfully');
        res.status(201).json(newTx);
    } catch (err) {
        console.error('Error saving transaction:', err.message);
        res.status(400).json({ error: err.message });
    }
});

// --- USAGES ROUTES ---

app.get('/api/usages/:userId', async (req, res) => {
    try {
        const usages = await Usage.find({ userId: req.params.userId }).sort({ createdAt: -1 });
        res.json(usages);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/usages', async (req, res) => {
    try {
        console.log('Saving usage:', req.body);
        const newUsage = new Usage(req.body);
        await newUsage.save();
        console.log('Usage saved successfully');
        res.status(201).json(newUsage);
    } catch (err) {
        console.error('Error saving usage:', err.message);
        res.status(400).json({ error: err.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
