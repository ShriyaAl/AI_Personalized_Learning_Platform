import express from 'express';
import fetch from 'node-fetch';

const videoRouter = express.Router();

// Trusted educational channels provided by the user
const TRUSTED_CHANNELS = [
    "UCVHZmCMKHjEGTMgaAKKFWYA",
    "UCWX3yGbODI3RHpz6lGz0p0Q",
    "UCsooa4yRKGN_zEE8iknghZA",
    "UCVTyTA7KudpVZn9yTtIBkEA",
    "UCYO_jab_esuFRV4b17AJtAw",
    "UC6107grRI4m0o2-emgoDnAA",
    "UCoxcjq-8xIDTYp3uz647V5A"
];

// Ranking logic provided by the user
function scoreVideo(item, keyword) {
    let score = 0;
    const title = item.snippet.title.toLowerCase();

    if (title.includes(keyword.toLowerCase())) score += 3;
    if (title.includes("explain") || title.includes("tutorial")) score += 2;
    if (TRUSTED_CHANNELS.includes(item.snippet.channelId)) score += 5;

    return score;
}

videoRouter.get('/search', async (req, res) => {
    const { keyword } = req.query;
    const apiKey = process.env.YOUTUBE_API_KEY;

    if (!keyword) {
        return res.status(400).json({ error: 'Keyword is required' });
    }

    if (!apiKey || apiKey === "PASTE_YOUR_YOUTUBE_API_KEY_HERE") {
        return res.status(500).json({ error: 'YouTube API Key is missing. Please add it to backend/.env' });
    }

    const query = keyword.trim() + " explanation for students";
    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query)}&type=video&maxResults=10&safeSearch=moderate&key=${apiKey}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.error) {
            throw new Error(data.error.message);
        }

        if (!data.items || data.items.length === 0) {
            return res.json({ videoResult: null });
        }

        // Filter trusted channels
        const filtered = data.items.filter(item =>
            TRUSTED_CHANNELS.includes(item.snippet.channelId)
        );

        // Fallback if no trusted videos
        const finalResults = filtered.length > 0 ? filtered : data.items;

        // Rank videos
        const ranked = finalResults.sort((a, b) =>
            scoreVideo(b, keyword) - scoreVideo(a, keyword)
        );

        // Pick top video
        res.json({ videoResult: ranked[0] });

    } catch (err) {
        console.error("YouTube Search Error:", err);
        res.status(500).json({ error: err.message });
    }
});

export default videoRouter;
