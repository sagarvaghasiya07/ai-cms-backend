#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

console.log('🚀 AI CMS Backend Setup Script');
console.log('================================\n');

// Function to generate random secrets
function generateSecret(length = 32) {
    return crypto.randomBytes(length).toString('hex');
}

// Function to check if file exists
function fileExists(filePath) {
    return fs.existsSync(filePath);
}

// Function to create .env file
function createEnvFile() {
    const envExamplePath = path.join(__dirname, '..', 'env.example');
    const envPath = path.join(__dirname, '..', '.env');
    
    if (fileExists(envPath)) {
        console.log('⚠️  .env file already exists. Skipping creation.');
        return;
    }
    
    if (!fileExists(envExamplePath)) {
        console.log('❌ env.example file not found. Please create it first.');
        return;
    }
    
    try {
        // Read the example file
        let envContent = fs.readFileSync(envExamplePath, 'utf8');
        
        // Generate secrets
        const sessionSecret = generateSecret(32);
        const jwtSecret = generateSecret(32);
        
        // Replace placeholder secrets
        envContent = envContent.replace(
            'SESSION_SECRET=your-super-secret-session-key-change-this-in-production',
            `SESSION_SECRET=${sessionSecret}`
        );
        
        envContent = envContent.replace(
            'JWT_SECRET=your-jwt-secret-key-change-this-in-production',
            `JWT_SECRET=${jwtSecret}`
        );
        
        // Write the .env file
        fs.writeFileSync(envPath, envContent);
        console.log('✅ .env file created successfully with generated secrets');
        
    } catch (error) {
        console.error('❌ Error creating .env file:', error.message);
    }
}

// Function to check dependencies
function checkDependencies() {
    const packageJsonPath = path.join(__dirname, '..', 'package.json');
    
    if (!fileExists(packageJsonPath)) {
        console.log('❌ package.json not found. Please run this script from the project root.');
        return;
    }
    
    console.log('📦 Checking dependencies...');
    
    try {
        const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
        const dependencies = Object.keys(packageJson.dependencies || {});
        
        console.log(`✅ Found ${dependencies.length} dependencies`);
        console.log('📋 Key dependencies:');
        dependencies.forEach(dep => {
            console.log(`   - ${dep}`);
        });
        
    } catch (error) {
        console.error('❌ Error reading package.json:', error.message);
    }
}

// Function to create uploads directory
function createUploadsDir() {
    const uploadsPath = path.join(__dirname, '..', 'uploads');
    
    if (!fileExists(uploadsPath)) {
        try {
            fs.mkdirSync(uploadsPath, { recursive: true });
            console.log('✅ Created uploads directory');
        } catch (error) {
            console.error('❌ Error creating uploads directory:', error.message);
        }
    } else {
        console.log('✅ Uploads directory already exists');
    }
}

// Function to check MongoDB connection
async function checkMongoDB() {
    console.log('🔍 Checking MongoDB connection...');
    
    try {
        const mongoose = require('mongoose');
        const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/ai-cms';
        
        await mongoose.connect(mongoUri, {
            serverSelectionTimeoutMS: 5000
        });
        
        console.log('✅ MongoDB connection successful');
        await mongoose.disconnect();
        
    } catch (error) {
        console.log('⚠️  MongoDB connection failed. Please ensure MongoDB is running.');
        console.log('   You can install MongoDB locally or use MongoDB Atlas.');
        console.log('   Update MONGODB_URI in your .env file with your connection string.');
    }
}

// Function to display next steps
function displayNextSteps() {
    console.log('\n🎯 Next Steps:');
    console.log('==============');
    console.log('1. Install dependencies: npm install');
    console.log('2. Update your .env file with your specific values:');
    console.log('   - GROQ_API_KEY (get from https://console.groq.com/)');
    console.log('   - MONGODB_URI (your database connection string)');
    console.log('   - FRONTEND_URL (your frontend application URL)');
    console.log('3. Start the development server: npm run dev');
    console.log('4. Test the API: curl http://localhost:5000/health');
    console.log('\n📚 For more information, see the README.md file');
}

// Main setup function
async function setup() {
    console.log('🔧 Starting setup...\n');
    
    // Create .env file
    createEnvFile();
    
    // Check dependencies
    checkDependencies();
    
    // Create uploads directory
    createUploadsDir();
    
    // Load environment variables for MongoDB check
    require('dotenv').config();
    
    // Check MongoDB connection
    await checkMongoDB();
    
    // Display next steps
    displayNextSteps();
    
    console.log('\n✨ Setup complete! Happy coding! 🚀');
}

// Run setup
setup().catch(console.error); 