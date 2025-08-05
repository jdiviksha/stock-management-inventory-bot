const fetch = require('node-fetch');
require('dotenv').config();

const HF_MODEL = "mistralai/Mistral-7B-Instruct-v0.2";

async function processIntent(userText) {
    const prompt = `
You are an AI assistant that extracts intent and data from user messages related to managing grocery stock.

Here are some examples:

User: Add 5 kg rice
Response (in JSON): { "intent": "add_stock", "item": "rice", "quantity": "5 kg" }

User: Add 2 litres milk today
Response (in JSON): { "intent": "add_stock", "item": "milk", "quantity": "2 litres" }

User: Show summary
Response (in JSON): { "intent": "summary" }

Now process this:
User: ${userText}
Response (in JSON):
    `.trim();

    const response = await fetch(`https://api-inference.huggingface.co/models/${HF_MODEL}`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            inputs: prompt,
            parameters: {
                temperature: 0.3,
                max_new_tokens: 100
            }
        })
    });

    if (!response.ok) {
        const error = await response.text();
        console.error("🛑 Hugging Face Intent API Error:", error);
        throw new Error("Intent processing failed");
    }

    const result = await response.json();
    const outputText = result?.[0]?.generated_text || "";

    // Extract JSON from the response (between first '{' and last '}')
    const jsonMatch = outputText.match(/{[\s\S]*?}/);
    if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
    }

    throw new Error("Could not extract intent JSON from response.");
}

module.exports = { processIntent };
