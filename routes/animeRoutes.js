import express from 'express';
import fetch from 'node-fetch';
const router = express.Router();

// GET /api/anime
router.get('/', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const searchQuery = req.query.q || ''; // Tambah parameter pencarian
        
        // Base URL untuk Jikan API
        let apiUrl = 'https://api.jikan.moe/v4/anime';
        
        // Jika ada query pencarian, gunakan endpoint search
        if (searchQuery) {
            apiUrl += `?q=${encodeURIComponent(searchQuery)}&page=${page}&sfw=true`;
        } else {
            // Jika tidak ada pencarian, tampilkan berdasarkan popularitas
            apiUrl += `?page=${page}&order_by=members&sort=desc&sfw=true`;
        }
        
        const response = await fetch(apiUrl);
        
        if (!response.ok) {
            throw new Error(`Jikan API error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        const formattedResponse = {
            pagination: {
                has_next_page: data.pagination.has_next_page,
                current_page: data.pagination.current_page,
                total_pages: data.pagination.last_visible_page
            },
            data: data.data
        };

        res.json(formattedResponse);
        
    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({ 
            success: false,
            message: 'Terjadi kesalahan server' 
        });
    }
});

export default router;