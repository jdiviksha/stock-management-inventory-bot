// ✅ NEW CODE (Dynamic, secure, production-ready)
require('dotenv').config(); // Load variables from .env

const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
    throw new Error("❌ Supabase URL or Anon Key is missing. Check your .env file.");
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Save stock entry
async function saveStockEntry(userId, data) {
    const { item, quantity, unit } = data;

    const { error } = await supabase
        .from('stocks')
        .insert([{ user_id: userId, item, quantity, unit }]);

    if (error) {
        console.error("❌ Error saving stock:", error.message);
    } else {
        console.log(`✅ Stock saved for ${item}`);
    }
}

// Get summary
async function getStockSummary(userId) {
    const { data, error } = await supabase
        .from('stocks')
        .select('item, quantity, unit, timestamp')
        .eq('user_id', userId)
        .order('timestamp', { ascending: false });

    if (error) return '❌ Failed to fetch stock summary';

    if (!data || data.length === 0) return '📦 No stock entries yet.';

    let response = '📊 Your stock summary:\n\n';
    data.forEach((entry, index) => {
        response += `${index + 1}. ${entry.item} - ${entry.quantity} ${entry.unit || ''} (${new Date(entry.timestamp).toLocaleDateString()})\n`;
    });

    return response;
}

module.exports = {
    saveStockEntry,
    getStockSummary
};
