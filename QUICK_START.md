# 🚀 Quick Start Guide

Get your AI CMS Backend up and running in minutes!

## Option 1: Local Development (Recommended)

### Prerequisites
- Node.js 16+ installed
- MongoDB running locally or MongoDB Atlas account
- Groq AI API key

### Steps

1. **Clone and install**
   ```bash
   git clone <your-repo-url>
   cd ai-cms-backend
   npm install
   ```

2. **Run setup script**
   ```bash
   npm run setup
   ```

3. **Configure environment**
   ```bash
   # Edit .env file with your values
   nano .env
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Test the API**
   ```bash
   curl http://localhost:5000/health
   ```

## Option 2: Docker (Easiest)

### Prerequisites
- Docker and Docker Compose installed

### Steps

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd ai-cms-backend
   ```

2. **Set your Groq API key**
   ```bash
   export GROQ_API_KEY=your-groq-api-key
   ```

3. **Start with Docker Compose**
   ```bash
   docker-compose up -d
   ```

4. **Access the services**
   - API: http://localhost:5000
   - MongoDB Express: http://localhost:8081 (admin/admin123)

## Option 3: Production Deployment

### Using Docker

1. **Build the image**
   ```bash
   docker build -t ai-cms-backend .
   ```

2. **Run with environment variables**
   ```bash
   docker run -d \
     -p 5000:5000 \
     -e MONGODB_URI=your-mongodb-uri \
     -e GROQ_API_KEY=your-groq-api-key \
     -e SESSION_SECRET=your-session-secret \
     -e JWT_SECRET=your-jwt-secret \
     ai-cms-backend
   ```

### Using PM2

1. **Install PM2**
   ```bash
   npm install -g pm2
   ```

2. **Start the application**
   ```bash
   pm2 start index.js --name "ai-cms-backend"
   ```

## 🔑 Required Environment Variables

### Essential (must be set)
- `GROQ_API_KEY` - Your Groq AI API key
- `MONGODB_URI` - MongoDB connection string
- `SESSION_SECRET` - Secret for session encryption
- `JWT_SECRET` - Secret for JWT token signing

### Optional (have defaults)
- `PORT` - Server port (default: 5000)
- `NODE_ENV` - Environment mode (default: development)
- `FRONTEND_URL` - Frontend URL for CORS (default: http://localhost:3000)

## 🧪 Testing the API

### Health Check
```bash
curl http://localhost:5000/health
```

### User Registration
```bash
curl -X POST http://localhost:5000/api/user/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "test@example.com",
    "password": "password123",
    "name": "Test User"
  }'
```

### User Login
```bash
curl -X POST http://localhost:5000/api/user/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "test@example.com",
    "password": "password123"
  }'
```

### Generate AI Content
```bash
curl -X POST http://localhost:5000/api/content/generate \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "prompt": "Write a short article about artificial intelligence",
    "type": "article"
  }'
```

## 🐛 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running
   - Check your connection string
   - For Docker: `docker-compose logs mongodb`

2. **Groq API Errors**
   - Verify your API key is correct
   - Check your Groq account status
   - Ensure you have sufficient credits

3. **Port Already in Use**
   - Change the PORT in .env file
   - Kill the process using the port: `lsof -ti:5000 | xargs kill -9`

4. **Permission Errors (Docker)**
   - Run with sudo or add user to docker group
   - Check file permissions

### Getting Help

- Check the logs: `docker-compose logs ai-cms-backend`
- Review the full README.md
- Check the API documentation in README.md
- Create an issue in the repository

## 📚 Next Steps

1. **Explore the API** - Use the endpoints documented in README.md
2. **Build a frontend** - Create a React/Vue/Angular app to consume the API
3. **Add features** - Extend the content management capabilities
4. **Deploy to production** - Use cloud platforms like Heroku, AWS, or DigitalOcean

## 🎯 Quick Commands Reference

```bash
# Development
npm run dev          # Start development server
npm run setup        # Run setup script
npm start           # Start production server

# Docker
docker-compose up -d    # Start all services
docker-compose down     # Stop all services
docker-compose logs     # View logs

# Database
docker-compose exec mongodb mongo  # Access MongoDB shell
docker-compose exec mongodb mongo ai-cms  # Access specific database

# Testing
curl http://localhost:5000/health  # Health check
```

---

**Happy coding! 🚀** 