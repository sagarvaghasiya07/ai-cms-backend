# AI CMS Backend API Documentation

## Table of Contents
1. [Overview](#overview)
2. [Base URL](#base-url)
3. [Authentication](#authentication)
4. [API Endpoints](#api-endpoints)
   - [Health Check](#health-check)
   - [User Management](#user-management)
   - [Content Management](#content-management)

---

## Overview

The AI CMS Backend is a comprehensive content management system that leverages AI to generate various types of content. The API provides endpoints for user authentication, content generation, and content management.

## Base URL

```
http://localhost:3000
```

## Authentication

The API uses JWT (JSON Web Token) authentication for protected endpoints. Include the token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

---

## API Endpoints

### Health Check

#### GET /health
**Purpose**: Check if the AI CMS Backend service is running and healthy.

**Why we use it**: This endpoint is essential for monitoring and ensuring the service is operational. It's commonly used by load balancers, monitoring tools, and health check systems.

**How it works**: Returns a simple JSON response with a success status and timestamp.

**Authentication**: Not required

**Response**:
```json
{
  "success": true,
  "message": "AI CMS Backend is running",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

---

### User Management

#### POST /api/user/auth/google
**Purpose**: Authenticate users using Google OAuth.

**Why we use it**: Provides secure, passwordless authentication using Google's OAuth service. This is more secure and user-friendly than traditional username/password authentication.

**How it works**: 
1. Validates the Google access token
2. Retrieves user information from Google
3. Creates or updates user record in the database
4. Returns user data with a JWT token for subsequent API calls

**Authentication**: Requires Google OAuth token

**Request Body**:
```json
{
  "access_token": "google_access_token_here"
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "userId": "user_123",
    "name": "John Doe",
    "email": "john@example.com",
    "profile_url": "https://example.com/profile.jpg",
    "singUpType": "google",
    "token": "jwt_token_here"
  },
  "message": "Login successful"
}
```

#### GET /api/user/get-profile
**Purpose**: Retrieve the current user's profile information.

**Why we use it**: Allows users to view their profile details and verify their authentication status.

**How it works**: 
1. Validates the JWT token from the Authorization header
2. Retrieves user information from the database
3. Returns user profile data

**Authentication**: Required (JWT token)

**Headers**:
```
Authorization: Bearer <jwt_token>
```

**Response**:
```json
{
  "success": true,
  "data": {
    "userId": "user_123",
    "name": "John Doe",
    "profile_url": "https://example.com/profile.jpg",
    "email": "john@example.com",
    "role": "Content Creator",
    "singUpType": "google",
    "lastLogin": "2024-01-15T10:30:00.000Z",
    "createdAt": "2024-01-01T00:00:00.000Z"
  },
  "message": "Profile retrieved successfully"
}
```

#### GET /api/user/get-statastic
**Purpose**: Retrieve user statistics and analytics about their content generation.

**Why we use it**: Provides users with insights into their content creation activity, helping them track their productivity and usage patterns.

**How it works**: 
1. Validates the JWT token
2. Queries the database for various content statistics
3. Calculates metrics like total content generated, monthly content, and content by type
4. Returns comprehensive statistics

**Authentication**: Required (JWT token)

**Headers**:
```
Authorization: Bearer <jwt_token>
```

**Response**:
```json
{
  "success": true,
  "data": {
    "totalContentGenerated": 150,
    "totalContentThisMonth": 25,
    "totalSocialMediaPostGenerated": 80,
    "totalEmailGenerated": 40,
    "totalProductDescriptionGenerated": 30
  },
  "message": "Statastic retrieved successfully"
}
```

---

### Content Management

#### GET /api/content/ai/get-template-list
**Purpose**: Retrieve a list of available AI content generation templates.

**Why we use it**: Allows users to see what types of content they can generate and choose the appropriate template for their needs.

**How it works**: 
1. Queries the database for active templates
2. Returns template information including ID, name, and description
3. Templates define the structure and format for AI-generated content

**Authentication**: Not required

**Response**:
```json
{
  "success": true,
  "data": [
    {
      "templateId": "TR348RU39R",
      "name": "Social Media Post"
    },
    {
      "templateId": "TE23R82U33",
      "name": "Email Subject Line"
    },
    {
      "templateId": "T349RU3984",
      "name": "Product Descriptions"
    }
  ],
  "message": "Template list retrieved successfully"
}
```

#### POST /api/content/ai/generate-content
**Purpose**: Generate AI-powered content based on user input and selected template.

**Why we use it**: The core functionality of the CMS - allows users to create high-quality, AI-generated content for various purposes like social media posts, email subject lines, and product descriptions.

**How it works**: 
1. Validates user authentication and template
2. Formats the prompt using the selected template
3. Sends the prompt to the Groq AI service
4. Parses the AI response to extract structured content (title, category, keywords, content, tags)
5. Saves the generated content to the database
6. Updates template usage statistics

**Authentication**: Required (JWT token)

**Headers**:
```
Authorization: Bearer <jwt_token>
```

**Request Body**:
```json
{
  "userInput": "Create a social media post about sustainable fashion",
  "templateId": "TR348RU39R"
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "contentId": "content_123",
    "userId": "user_123",
    "title": "Sustainable Fashion: The Future of Style",
    "content": "Embrace eco-friendly fashion choices...",
    "wholeContent": "Title: Sustainable Fashion: The Future of Style\nCategory: Fashion\nKeywords: sustainable, fashion, eco-friendly, style\nContent: Embrace eco-friendly fashion choices...\nTags: #sustainablefashion #ecofriendly #fashion",
    "templateId": "TR348RU39R",
    "category": "Fashion",
    "keywords": ["sustainable", "fashion", "eco-friendly", "style"],
    "tags": ["sustainablefashion", "ecofriendly", "fashion"],
    "aiProvider": "groq",
    "createdAt": "2024-01-15T10:30:00.000Z"
  },
  "message": "Content generated successfully"
}
```

#### POST /api/content/ai/regenerate-content
**Purpose**: Regenerate AI content for an existing piece with new user input.

**Why we use it**: Allows users to improve or modify existing content without starting from scratch. Useful when the initial generation doesn't meet requirements or needs refinement.

**How it works**: 
1. Validates user authentication and content ownership
2. Combines the original prompt with new user input
3. Includes the previous AI response as context for regeneration
4. Generates new content using the same template
5. Updates the existing content record with the new generation

**Authentication**: Required (JWT token)

**Headers**:
```
Authorization: Bearer <jwt_token>
```

**Request Body**:
```json
{
  "contentId": "content_123",
  "userInput": "Make it more focused on luxury sustainable fashion"
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "contentId": "content_123",
    "title": "Luxury Sustainable Fashion: Premium Eco-Style",
    "content": "Discover the world of luxury sustainable fashion...",
    "wholeContent": "Title: Luxury Sustainable Fashion: Premium Eco-Style\nCategory: Fashion\nKeywords: luxury, sustainable, fashion, premium\nContent: Discover the world of luxury sustainable fashion...\nTags: #luxuryfashion #sustainable #premium",
    "templateId": "TR348RU39R",
    "category": "Fashion",
    "keywords": ["luxury", "sustainable", "fashion", "premium"],
    "tags": ["luxuryfashion", "sustainable", "premium"],
    "aiProvider": "groq",
    "isRegenerated": true,
    "updatedAt": "2024-01-15T11:00:00.000Z"
  },
  "message": "Content regenerated successfully"
}
```

#### GET /api/content/ai/get-content-list
**Purpose**: Retrieve a paginated list of user's generated content with filtering and search capabilities.

**Why we use it**: Allows users to browse, search, and filter their content library. Essential for content management and organization.

**How it works**: 
1. Validates user authentication
2. Applies search filters (title, keywords, tags, category, content)
3. Supports pagination for large content libraries
4. Includes template information for each content item
5. Returns structured data with pagination metadata

**Authentication**: Required (JWT token)

**Headers**:
```
Authorization: Bearer <jwt_token>
```

**Query Parameters**:
- `page` (optional): Page number for pagination (default: 1)
- `limit` (optional): Number of items per page (default: 10)
- `search` (optional): Search term to filter content
- `category` (optional): Filter by content category
- `templateId` (optional): Filter by template type

**Example Request**:
```
GET /api/content/ai/get-content-list?page=1&limit=10&search=sustainable&category=Fashion
```

**Response**:
```json
{
  "success": true,
  "data": {
    "list": [
      {
        "contentId": "content_123",
        "userId": "user_123",
        "title": "Sustainable Fashion: The Future of Style",
        "content": "Embrace eco-friendly fashion choices...",
        "createdAt": "2024-01-15T10:30:00.000Z",
        "templateDetails": {
          "templateId": "TR348RU39R",
          "name": "Social Media Post"
        },
        "category": "Fashion",
        "keywords": ["sustainable", "fashion", "eco-friendly"],
        "tags": ["sustainablefashion", "ecofriendly"],
        "aiProvider": "groq"
      }
    ],
    "current": 1,
    "pages": 5,
    "totalitems": 50
  },
  "message": "Content list retrieved successfully"
}
```

#### GET /api/content/ai/get-content-detail
**Purpose**: Retrieve detailed information about a specific content item.

**Why we use it**: Allows users to view the complete details of a specific piece of content, including the full AI response and metadata.

**How it works**: 
1. Validates user authentication and content ownership
2. Retrieves the complete content record from the database
3. Returns all content details including the original AI response

**Authentication**: Required (JWT token)

**Headers**:
```
Authorization: Bearer <jwt_token>
```

**Query Parameters**:
- `contentId` (required): The ID of the content to retrieve

**Example Request**:
```
GET /api/content/ai/get-content-detail?contentId=content_123
```

**Response**:
```json
{
  "success": true,
  "data": {
    "contentId": "content_123",
    "userId": "user_123",
    "title": "Sustainable Fashion: The Future of Style",
    "content": "Embrace eco-friendly fashion choices...",
    "wholeContent": "Title: Sustainable Fashion: The Future of Style\nCategory: Fashion\nKeywords: sustainable, fashion, eco-friendly, style\nContent: Embrace eco-friendly fashion choices...\nTags: #sustainablefashion #ecofriendly #fashion",
    "templateId": "TR348RU39R",
    "prompt": "Create a social media post about: sustainable fashion",
    "category": "Fashion",
    "keywords": ["sustainable", "fashion", "eco-friendly", "style"],
    "tags": ["sustainablefashion", "ecofriendly", "fashion"],
    "aiProvider": "groq",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  },
  "message": "Content details retrieved successfully"
}
```

#### POST /api/content/ai/edit-content
**Purpose**: Manually edit and update content details.

**Why we use it**: Allows users to customize and refine AI-generated content to better match their specific needs and requirements.

**How it works**: 
1. Validates user authentication and content ownership
2. Updates only the provided fields (title, content, category, keywords, tags)
3. Marks the content as manually edited
4. Updates the modification timestamp

**Authentication**: Required (JWT token)

**Headers**:
```
Authorization: Bearer <jwt_token>
```

**Request Body**:
```json
{
  "contentId": "content_123",
  "title": "Updated Title",
  "content": "Updated content text...",
  "category": "Updated Category",
  "keywords": ["updated", "keywords"],
  "tags": ["updated", "tags"]
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "contentId": "content_123",
    "title": "Updated Title",
    "content": "Updated content text...",
    "category": "Updated Category",
    "keywords": ["updated", "keywords"],
    "tags": ["updated", "tags"],
    "isEdited": true,
    "updatedAt": "2024-01-15T11:30:00.000Z"
  },
  "message": "Content updated successfully"
}
```

#### GET /api/content/ai/delete-content
**Purpose**: Soft delete a content item (marks as deleted but doesn't permanently remove).

**Why we use it**: Allows users to remove content from their library while maintaining data integrity and the possibility of recovery.

**How it works**: 
1. Validates user authentication and content ownership
2. Marks the content as deleted (soft delete)
3. Content remains in the database but is excluded from queries
4. Maintains referential integrity

**Authentication**: Required (JWT token)

**Headers**:
```
Authorization: Bearer <jwt_token>
```

**Query Parameters**:
- `contentId` (required): The ID of the content to delete

**Example Request**:
```
GET /api/content/ai/delete-content?contentId=content_123
```

**Response**:
```json
{
  "success": true,
  "data": {},
  "message": "Content deleted successfully"
}
```

---

## Error Responses

All endpoints return consistent error responses in the following format:

```json
{
  "success": false,
  "message": "Error description",
  "code": 400
}
```

### Common HTTP Status Codes

- `200 OK`: Request successful
- `201 Created`: Resource created successfully
- `400 Bad Request`: Invalid request parameters
- `401 Unauthorized`: Authentication required or invalid
- `403 Forbidden`: Access denied
- `404 Not Found`: Resource not found
- `500 Internal Server Error`: Server error

### Common Error Messages

- `User not found`: User doesn't exist in the system
- `Content not found`: Requested content doesn't exist
- `Template not found`: Requested template doesn't exist
- `Invalid token`: JWT token is invalid or expired
- `Content ID is required`: Missing required content ID parameter
- `Template ID is required`: Missing required template ID parameter

---

## Rate Limiting

Currently, the API doesn't implement rate limiting. However, it's recommended to implement rate limiting for production use to prevent abuse.

## Security Considerations

1. **JWT Tokens**: All protected endpoints require valid JWT tokens
2. **Google OAuth**: User authentication is handled through Google's secure OAuth service
3. **Input Validation**: All user inputs are validated before processing
4. **Error Handling**: Sensitive information is not exposed in error messages

## Best Practices

1. **Authentication**: Always include the JWT token in the Authorization header for protected endpoints
2. **Error Handling**: Implement proper error handling for all API calls
3. **Pagination**: Use pagination parameters when retrieving large lists
4. **Search**: Utilize search and filter parameters to find specific content
5. **Content Management**: Regularly review and organize your generated content

---

## Support

For technical support or questions about the API, please contact the development team or refer to the project documentation. 