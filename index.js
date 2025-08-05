// ✅ WhatsApp Bot Setup
const { default: makeWASocket, DisconnectReason, useMultiFileAuthState } = require('@whiskeysockets/baileys');
const { Boom } = require('@hapi/boom');
const path = require('path');
const fs = require('fs');
const qrcode = require('qrcode-terminal'); // ✅ Import QR display module

// ✅ Import message handler logic
const { handleIncomingMessage } = require('./messageHandler');

// 📁 Folder where Baileys stores auth credentials
const AUTH_FOLDER = path.join(__dirname, 'auth');

async function connectToWhatsApp() {
    const { state, saveCreds } = await useMultiFileAuthState(AUTH_FOLDER);

    const sock = makeWASocket({
        auth: state,
        printQRInTerminal: false, // ❌ disable deprecated QR method
    });

    // 🔐 Save credentials on update
    sock.ev.on('creds.update', saveCreds);

    // 📩 Handle incoming messages
    sock.ev.on('messages.upsert', async ({ messages, type }) => {
        const msg = messages[0];

        // Ignore messages sent by bot itself
        if (!msg.key.fromMe && msg.message) {
            try {
                await handleIncomingMessage(sock, msg);
            } catch (err) {
                console.error('❌ Error handling message:', err);
            }
        }
    });

    // 🔌 Handle connection updates
    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect, qr } = update;

        if (qr) {
            // ✅ Show QR in terminal
            qrcode.generate(qr, { small: true });
        }

        if (connection === 'close') {
            const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;
            console.log('❌ Disconnected. Reconnecting:', shouldReconnect);
            if (shouldReconnect) {
                connectToWhatsApp(); // Reconnect
            }
        } else if (connection === 'open') {
            console.log("✅ WhatsApp bot is connected!");
        }
    });
}

// 🚀 Start the bot
connectToWhatsApp();
