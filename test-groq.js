require('dotenv').config();
const { generategroqContent } = require('./services/groq.service');

async function testGroqAPI() {
    try {
        console.log('Testing Groq API...');
        console.log('GROQ_API_KEY:', process.env.GROQ_API_KEY ? 'Set' : 'Not set');
        
        const testPrompt = "Write a short greeting message.";
        console.log('Test prompt:', testPrompt);
        
        const result = await generategroqContent(testPrompt);
        console.log('✅ Groq API Test Successful!');
        console.log('Response:', result);
    } catch (error) {
        console.error('❌ Groq API Test Failed:');
        console.error(error.message);
        
        if (error.message.includes('api_key')) {
            console.log('\n💡 Make sure to set your GROQ_API_KEY in the .env file');
        }
    }
}

testGroqAPI(); 