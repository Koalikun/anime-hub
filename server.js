import express from 'express';
import cors from 'cors';
import animeRoutes from './routes/animeRoutes.js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Logging middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

// Routes
app.use('/api/anime', animeRoutes);

// Test route
app.get('/test', (req, res) => {
    res.json({ message: 'Server berjalan dengan baik' });
});

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server berjalan di port ${PORT}`);
});