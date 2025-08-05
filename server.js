const express = require('express');
const multer = require('multer');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const { transcribeTamil } = require('./whisperService');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Create uploads directory if it doesn't exist
const uploadPath = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath);

// Multer config
const upload = multer({ dest: 'uploads/' });

// Endpoint: Transcribe audio
app.post('/transcribe', upload.single('audio'), async (req, res) => {
    try {
        const filePath = req.file.path;
        const text = await transcribeTamil(filePath);

        // Remove uploaded file after transcription
        fs.unlinkSync(filePath);

        res.json({ transcription: text });
    } catch (error) {
        console.error('❌ Transcription error:', error);
        res.status(500).json({ error: 'Transcription failed' });
    }
});

// Start API server
app.listen(PORT, () => {
    console.log(`🚀 API server running at http://localhost:${PORT}`);
});
