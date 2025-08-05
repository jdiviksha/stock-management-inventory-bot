const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');
require('dotenv').config(); // ⬅️ Make sure you load the .env file

const HUGGINGFACE_MODEL = 'openai/whisper-large';

async function transcribeTamil(audioPath) {
    const audio = fs.readFileSync(audioPath);

    const response = await fetch(`https://api-inference.huggingface.co/models/${HUGGINGFACE_MODEL}`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`, // ⬅️ REQUIRED
            'Content-Type': 'audio/wav',
        },
        body: audio,
    });

    if (!response.ok) {
        const error = await response.text();
        console.error('❌ Whisper API Error:', error);
        throw new Error('Failed to transcribe audio');
    }

    const result = await response.json();
    return result.text;
}

module.exports = {
    transcribeTamil
};
