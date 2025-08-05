const fs = require('fs');
const path = require('path');
const os = require('os');
const { transcribeTamil } = require('./whisperService');
const { downloadMediaMessage } = require('@whiskeysockets/baileys');

async function transcribeAudio(message) {
    const audioPath = path.join(os.tmpdir(), `audio-${Date.now()}.wav`);

    try {
        await downloadMediaMessage(message, 'audio', {}, {
            // Stores media to file
            filePath: audioPath,
        });

        const transcript = await transcribeTamil(audioPath);
        return transcript;
    } catch (error) {
        console.error('❌ Transcription failed:', error);
        return '';
    } finally {
        if (fs.existsSync(audioPath)) {
            fs.unlinkSync(audioPath);
        }
    }
}

module.exports = {
    transcribeAudio
};
