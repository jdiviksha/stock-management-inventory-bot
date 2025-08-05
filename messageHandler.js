const fs = require('fs');
const path = require('path');
const { getStockSummary, saveStockEntry } = require('./supabaseService');
const { transcribeAudio } = require('./whisper');
const { processIntent } = require('./llama');
const { downloadMediaMessage } = require('@whiskeysockets/baileys');
//const { downloadMediaMessage } = require('@whiskeysockets/baileys'); // <-- required for audio download


async function handleIncomingMessage(sock, msg) {
    const from = msg.key.remoteJid;
    const messageContent = msg.message;

    let text = '';

    if (messageContent.conversation) {
        text = messageContent.conversation;
    } else if (messageContent.extendedTextMessage?.text) {
        text = messageContent.extendedTextMessage.text;
    } else if (messageContent.audioMessage) {
        console.log('🎧 Voice message received. Downloading...');

        try {
            const audioBuffer = await downloadMediaMessage(
                msg,
                'buffer',
                {},
                { reuploadRequest: sock.ev }
            );

            const audioPath = path.join(__dirname, 'audio', `${Date.now()}.ogg`);
            fs.mkdirSync(path.dirname(audioPath), { recursive: true });
            fs.writeFileSync(audioPath, audioBuffer);

            text = await transcribeAudio(audioPath);

            fs.unlinkSync(audioPath); // Clean up after processing
        } catch (error) {
            console.error('❌ Failed to process voice message:', error);
            await sock.sendMessage(from, { text: "❌ Couldn't process your voice note." });
            return;
        }
    }

    console.log("📨 Message from", from, ":", text);

    if (!text) return;

    const { intent, data } = await processIntent(text); // LLaMA-powered parser

    if (intent === 'add_stock') {
        await saveStockEntry(from, data);
        await sock.sendMessage(from, { text: `✅ Stock entry added for ${data.item}` });
    } else if (intent === 'summary') {
        const summary = await getStockSummary(from);
        await sock.sendMessage(from, { text: summary });
    } else {
        await sock.sendMessage(from, { text: `🤖 Sorry, I didn't understand.` });
    }
}

module.exports = { handleIncomingMessage };
