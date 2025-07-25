# AI CMS Backend

A powerful AI-powered Content Management System backend built with Node.js, Express, and MongoDB. This system integrates with Groq AI for intelligent content generation and management.

## 🚀 Features

- **AI-Powered Content Generation**: Integration with Groq AI for intelligent content creation
- **User Authentication**: JWT-based authentication with Google OAuth support
- **Content Management**: CRUD operations for content with AI assistance
- **RESTful API**: Clean and well-structured API endpoints
- **Database Integration**: MongoDB with Mongoose ODM
- **Session Management**: Secure session handling with Passport.js
- **CORS Support**: Cross-origin resource sharing configuration
- **Logging**: Comprehensive request logging with Morgan

## 📋 Prerequisites

Before running this project, make sure you have the following installed:

- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **MongoDB** (local installation or MongoDB Atlas account)
- **Groq AI API Key** (for AI content generation)

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <your-repository-url>
   cd ai-cms-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   # Copy the environment template
   cp .env.example .env
   
   # Edit the .env file with your configuration
   nano .env
   ```

4. **Database Setup**
   - Ensure MongoDB is running locally or have a MongoDB Atlas connection string
   - The application will automatically create the necessary collections

5. **Start the development server**
   ```bash
   npm run dev
   ```

## ⚙️ Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/ai-cms

# Session Configuration
SESSION_SECRET=your-super-secret-session-key

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000

# AI Configuration
GROQ_API_KEY=your-groq-api-key

# JWT Configuration
JWT_SECRET=your-jwt-secret-key
JWT_EXPIRES_IN=7d

# Google OAuth (Optional)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=http://localhost:5000/auth/google/callback
```

## 📚 API Documentation

### Base URL
```
http://localhost:5000
```

### Health Check
```
GET /health
```

### Authentication Endpoints

#### User Registration
```
POST /api/user/register
Content-Type: application/json

{
  "username": "user@example.com",
  "password": "securepassword",
  "name": "John Doe"
}
```

#### User Login
```
POST /api/user/login
Content-Type: application/json

{
  "username": "user@example.com",
  "password": "securepassword"
}
```

#### Google OAuth
```
GET /auth/google
GET /auth/google/callback
```

### Content Management Endpoints

#### Get All Content
```
GET /api/content
Authorization: Bearer <jwt-token>
```

#### Create Content
```
POST /api/content
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "title": "Sample Content",
  "content": "This is sample content",
  "type": "article"
}
```

#### Generate AI Content
```
POST /api/content/generate
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "prompt": "Write an article about AI",
  "type": "article"
}
```

#### Update Content
```
PUT /api/content/:id
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "title": "Updated Title",
  "content": "Updated content"
}
```

#### Delete Content
```
DELETE /api/content/:id
Authorization: Bearer <jwt-token>
```

## 🏗️ Project Structure

```
ai-cms-backend/
├── common/                 # Common response utilities
├── config/                 # Configuration files
│   ├── db.config.js       # Database configuration
│   └── passport.config.js  # Passport authentication config
├── constant/               # Constants and messages
├── controller/             # Route controllers
├── middleware/             # Custom middleware
├── model/                  # Database models
├── routes/                 # API routes
├── services/               # Business logic services
├── utils/                  # Utility functions
├── index.js               # Main application entry point
└── package.json           # Dependencies and scripts
```

## 🚀 Available Scripts

- `npm start` - Start the production server
- `npm run dev` - Start the development server with nodemon
- `npm test` - Run tests (currently not configured)
- `npm run setup` - Run setup script (if available)

## 🔧 Configuration

### Database Configuration
The application uses MongoDB with Mongoose. Configure your database connection in `config/db.config.js`.

### AI Integration
The system integrates with Groq AI for content generation. Configure your API key in the environment variables.

### Authentication
- JWT-based authentication for API endpoints
- Google OAuth support for web authentication
- Session-based authentication for web clients

## 🛡️ Security Features

- **CORS Protection**: Configured to allow specific origins
- **Session Security**: Secure session configuration with HTTP-only cookies
- **Password Hashing**: Bcrypt for password security
- **JWT Tokens**: Secure token-based authentication
- **Request Validation**: Input validation and sanitization

## 📦 Dependencies

### Core Dependencies
- `express` - Web framework
- `mongoose` - MongoDB ODM
- `passport` - Authentication middleware
- `jsonwebtoken` - JWT handling
- `bcryptjs` - Password hashing
- `cors` - Cross-origin resource sharing
- `dotenv` - Environment variable management

### AI & External Services
- `openai` - Groq AI integration
- `axios` - HTTP client for external APIs

### Development Dependencies
- `nodemon` - Development server with auto-reload
- `morgan` - HTTP request logging

## 🚀 Deployment

### Local Development
```bash
npm run dev
```

### Production Deployment
1. Set `NODE_ENV=production` in your environment variables
2. Ensure all environment variables are properly configured
3. Run the application:
   ```bash
   npm start
   ```

### Docker Deployment (Optional)
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

## 🔍 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running
   - Check your `MONGODB_URI` environment variable
   - Verify network connectivity

2. **Groq API Errors**
   - Verify your `GROQ_API_KEY` is correct
   - Check your Groq account status and API limits

3. **CORS Issues**
   - Ensure `FRONTEND_URL` is correctly set
   - Check browser console for CORS errors

4. **Authentication Issues**
   - Verify JWT secret is set
   - Check token expiration
   - Ensure proper Authorization headers

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 👨‍💻 Author

**Sagar Vaghasiya**

## 📞 Support

For support and questions:
- Create an issue in the repository
- Contact the development team

---

**Note**: This is a backend API service. You'll need a frontend application to interact with the API endpoints. The system is designed to work with any frontend framework (React, Vue, Angular, etc.).
