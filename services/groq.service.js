const { OpenAI } = require('openai');

const openai = new OpenAI({
    apiKey: process.env.GROQ_API_KEY, // Use GROQ_API_KEY instead of OPENAI_API_KEY
    baseURL: 'https://api.groq.com/openai/v1', // Groq's API endpoint
});

async function generategroqContent(prompt, model = "llama3-8b-8192") {
    try {
        const chatCompletion = await openai.chat.completions.create({
            model, // Available Groq models: llama3-8b-8192, mixtral-8x7b-32768, gemma2-9b-it
            messages: [{ role: "user", content: prompt }],
            max_tokens: 1024,
            temperature: 0.7,
        });
        return chatCompletion.choices[0].message.content.trim();
    } catch (error) {
        console.error('Groq API Error:', error);
        throw new Error('Failed to generate content from Groq');
    }
}

module.exports = { generategroqContent };
