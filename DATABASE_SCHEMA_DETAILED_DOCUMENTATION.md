# AI CMS Backend - Detailed Database Schema Documentation

## Table of Contents
1. [Database Overview](#database-overview)
2. [Table Relationships Diagram](#table-relationships-diagram)
3. [Detailed Table Documentation](#detailed-table-documentation)
   - [Users Table](#users-table)
   - [Content Table](#content-table)
   - [Templates Table](#templates-table)
4. [Key Relationships and Constraints](#key-relationships-and-constraints)
5. [Index Strategy](#index-strategy)
6. [Data Flow and Usage Patterns](#data-flow-and-usage-patterns)

---

## Database Overview

**Database Type**: MongoDB (NoSQL Document Database)  
**ODM**: Mongoose (Object Document Mapper)  
**Database Name**: `ai-cms`  
**Collections**: 3 main collections (tables in MongoDB terminology)

### Why MongoDB for this project?
- **Flexible Schema**: Allows easy addition of new fields without migrations
- **JSON-like Documents**: Natural fit for content management with nested data
- **Scalability**: Horizontal scaling capabilities for growing content
- **Performance**: Fast queries for content search and retrieval

---

## Table Relationships Diagram

```
┌─────────────────┐         ┌─────────────────┐         ┌─────────────────┐
│     USERS       │         │     CONTENT     │         │    TEMPLATES    │
│                 │         │                 │         │                 │
│ userId (PK)     │◄────────┤ userId (FK)     │         │ templateId (PK) │
│ name            │         │ contentId (PK)  │◄────────┤ name            │
│ email           │         │ prompt          │         │ templateFormet  │
│ profile_url     │         │ templateId (FK) │         │ description     │
│ googleId        │         │ wholeContent    │         │ isActive        │
│ singUpType      │         │ title           │         │ usedCount       │
│ role            │         │ content         │         │                 │
│ lastLogin       │         │ category        │         │                 │
│ isActive        │         │ keywords[]      │         │                 │
│ isDeleted       │         │ tags[]          │         │                 │
│ createdAt       │         │ aiProvider      │         │                 │
│ updatedAt       │         │ isEdited        │         │                 │
│                 │         │ isRegenerated   │         │                 │
│                 │         │ isDeleted       │         │                 │
│                 │         │ createdAt       │         │                 │
│                 │         │ updatedAt       │         │                 │
└─────────────────┘         └─────────────────┘         └─────────────────┘
```

**Relationship Types:**
- **Users → Content**: One-to-Many (1:N)
- **Templates → Content**: One-to-Many (1:N)

---

## Detailed Table Documentation

### Users Table

**Collection Name**: `users`  
**Purpose**: Central repository for user account management and authentication

#### Table Structure

| Field | Type | Required | Default | Key Type | Description |
|-------|------|----------|---------|----------|-------------|
| `_id` | ObjectId | Auto | Auto | **Primary Key** | MongoDB's default unique identifier |
| `userId` | String | Yes | Auto-generated | **Unique Key** | Custom user identifier (U + 9 chars) |
| `name` | String | Yes | - | - | User's full name |
| `email` | String | Yes | - | **Index** | User's email address |
| `profile_url` | String | Yes | - | - | URL to user's profile picture |
| `googleId` | String | No | - | **Index** | Google OAuth ID for authentication |
| `singUpType` | String | No | - | - | Authentication method (e.g., "google") |
| `role` | String | No | "Content Creator" | - | User's role in the system |
| `lastLogin` | Date | No | Current UTC | - | Timestamp of last login |
| `isActive` | Boolean | No | true | - | Whether the user account is active |
| `isDeleted` | Boolean | No | false | - | Soft delete flag |
| `createdAt` | Date | Auto | Current time | - | Record creation timestamp |
| `updatedAt` | Date | Auto | Current time | - | Record last update timestamp |

#### Key Analysis

**Primary Key**: `_id` (MongoDB ObjectId)
- **Why**: MongoDB's default unique identifier
- **Purpose**: Internal database reference
- **Usage**: Used by MongoDB for internal operations

**Unique Key**: `userId` (String)
- **Why**: Custom human-readable identifier
- **Purpose**: External API reference and user identification
- **Format**: "U" + 9 random characters (e.g., "U123456789")
- **Usage**: Used in API responses and foreign key relationships

**Indexed Fields**:
- `email`: For email-based authentication and user searches
- `googleId`: For Google OAuth authentication

#### Why This Table Exists

1. **User Authentication**: Stores user credentials and authentication data
2. **Content Ownership**: Links content to specific users
3. **User Management**: Enables user profile management and role-based access
4. **Session Management**: Tracks user login history and activity
5. **Data Isolation**: Ensures users can only access their own content

#### Usage Patterns

```javascript
// User creation during Google OAuth
const newUser = await userModel.create({
    name: "John Doe",
    email: "john@example.com",
    profile_url: "https://example.com/profile.jpg",
    googleId: "google_oauth_id_123",
    singUpType: "google"
});

// User authentication
const user = await userModel.findOne({ googleId: "google_oauth_id_123" });

// Content ownership validation
const userContent = await contentModel.find({ userId: "U123456789" });
```

---

### Content Table

**Collection Name**: `content`  
**Purpose**: Stores all AI-generated content with metadata and user input

#### Table Structure

| Field | Type | Required | Default | Key Type | Description |
|-------|------|----------|---------|----------|-------------|
| `_id` | ObjectId | Auto | Auto | **Primary Key** | MongoDB's default unique identifier |
| `contentId` | String | Yes | Auto-generated | **Unique Key** | Custom content identifier (C + 9 chars) |
| `userId` | String | Yes | - | **Foreign Key** | Reference to users.userId |
| `prompt` | String | Yes | - | - | Original user input sent to AI |
| `templateId` | String | Yes | - | **Foreign Key** | Reference to templates.templateId |
| `wholeContent` | String | Yes | - | - | Complete AI response with structure |
| `title` | String | Yes | - | **Index** | Extracted title from AI response |
| `content` | String | Yes | - | **Index** | Main content text (cleaned) |
| `category` | String | No | - | **Index** | Content category (e.g., "Fashion") |
| `keywords` | Array[String] | No | [] | - | Extracted keywords from content |
| `tags` | Array[String] | No | [] | - | Extracted hashtags/tags |
| `aiProvider` | String | No | "groq" | - | AI service used for generation |
| `isEdited` | Boolean | No | false | - | Whether content was manually edited |
| `isRegenerated` | Boolean | No | false | - | Whether content was regenerated |
| `isDeleted` | Boolean | No | false | - | Soft delete flag |
| `createdAt` | Date | Auto | Current time | **Index** | Record creation timestamp |
| `updatedAt` | Date | Auto | Current time | - | Record last update timestamp |

#### Key Analysis

**Primary Key**: `_id` (MongoDB ObjectId)
- **Why**: MongoDB's default unique identifier
- **Purpose**: Internal database reference
- **Usage**: Used by MongoDB for internal operations

**Unique Key**: `contentId` (String)
- **Why**: Custom human-readable identifier
- **Purpose**: External API reference and content identification
- **Format**: "C" + 9 random characters (e.g., "C987654321")
- **Usage**: Used in API responses and content management operations

**Foreign Keys**:
- `userId`: References `users.userId`
  - **Why**: Links content to specific user
  - **Purpose**: Content ownership and data isolation
  - **Constraint**: Ensures content belongs to valid user
  - **Usage**: User-specific content queries and security

- `templateId`: References `templates.templateId`
  - **Why**: Links content to specific template
  - **Purpose**: Content categorization and template usage tracking
  - **Constraint**: Ensures content uses valid template
  - **Usage**: Template-based queries and analytics

**Indexed Fields**:
- `userId + contentId`: Compound index for user-specific content queries
- `createdAt`: For chronological ordering and date-based queries
- `title`: For content search functionality
- `content`: For full-text content search
- `category`: For category-based filtering
- `templateId`: For template-based content queries

#### Why This Table Exists

1. **Content Storage**: Central repository for all AI-generated content
2. **Content Management**: Enables content CRUD operations
3. **Search and Filtering**: Supports content search and categorization
4. **Analytics**: Provides data for usage analytics and insights
5. **Version Control**: Tracks content modifications and regeneration
6. **Data Isolation**: Ensures users can only access their own content

#### Usage Patterns

```javascript
// Content creation
const newContent = await contentModel.create({
    userId: "U123456789",
    prompt: "Create a social media post about sustainable fashion",
    templateId: "TR348RU39R",
    wholeContent: "Title: Sustainable Fashion...",
    title: "Sustainable Fashion: The Future of Style",
    content: "Embrace eco-friendly fashion choices...",
    category: "Fashion",
    keywords: ["sustainable", "fashion", "eco-friendly"],
    tags: ["sustainablefashion", "ecofriendly"]
});

// User's content with pagination
const userContent = await contentModel.find({ 
    userId: "U123456789", 
    isDeleted: false 
}).sort({ createdAt: -1 }).skip(offset).limit(limit);

// Content search
const searchResults = await contentModel.find({
    userId: "U123456789",
    $or: [
        { title: { $regex: searchTerm, $options: 'i' } },
        { content: { $regex: searchTerm, $options: 'i' } }
    ]
});
```

---

### Templates Table

**Collection Name**: `templates`  
**Purpose**: Defines content generation templates and their formats

#### Table Structure

| Field | Type | Required | Default | Key Type | Description |
|-------|------|----------|---------|----------|-------------|
| `_id` | ObjectId | Auto | Auto | **Primary Key** | MongoDB's default unique identifier |
| `templateId` | String | Yes | - | **Unique Key** | Custom template identifier |
| `name` | String | Yes | - | - | Human-readable template name |
| `templateFormet` | String | Yes | - | - | Template format with placeholders |
| `description` | String | Yes | - | - | Template description and usage |
| `isActive` | Boolean | No | true | - | Whether template is available |
| `usedCount` | Number | No | 0 | - | Number of times template used |
| `createdAt` | Date | Auto | Current time | - | Record creation timestamp |
| `updatedAt` | Date | Auto | Current time | - | Record last update timestamp |

#### Key Analysis

**Primary Key**: `_id` (MongoDB ObjectId)
- **Why**: MongoDB's default unique identifier
- **Purpose**: Internal database reference
- **Usage**: Used by MongoDB for internal operations

**Unique Key**: `templateId` (String)
- **Why**: Custom human-readable identifier
- **Purpose**: External API reference and template identification
- **Format**: Custom format (e.g., "TR348RU39R")
- **Usage**: Used in API responses and foreign key relationships

**Indexed Fields**:
- `templateId`: For fast template lookups

#### Why This Table Exists

1. **Template Management**: Central repository for content generation templates
2. **Content Structure**: Defines format and structure for AI responses
3. **Content Categorization**: Enables content categorization by template type
4. **Usage Analytics**: Tracks template popularity and usage patterns
5. **Flexibility**: Allows easy addition of new content types
6. **Consistency**: Ensures consistent content structure across the platform

#### Usage Patterns

```javascript
// Get active templates
const templates = await templateModel.find({ isActive: true });

// Template usage tracking
await templateModel.updateOne(
    { templateId: "TR348RU39R" },
    { $inc: { usedCount: 1 } }
);

// Template-based content queries
const socialMediaContent = await contentModel.find({
    templateId: "TR348RU39R",
    userId: "U123456789"
});
```

---

## Key Relationships and Constraints

### 1. Users → Content (One-to-Many)

**Relationship Type**: One-to-Many (1:N)  
**Foreign Key**: `content.userId` references `users.userId`

**Why This Relationship Exists**:
- **Content Ownership**: Every piece of content must belong to a user
- **Data Isolation**: Users can only access their own content
- **Security**: Prevents unauthorized access to other users' content
- **Analytics**: Enables user-specific analytics and reporting

**Constraints**:
- `content.userId` must reference a valid `users.userId`
- Content queries must include `userId` for security
- Soft delete in users affects content visibility

**Usage Examples**:
```javascript
// Get all content for a specific user
const userContent = await contentModel.find({ userId: "U123456789" });

// Validate content ownership
const content = await contentModel.findOne({ 
    contentId: "C987654321", 
    userId: "U123456789" 
});
```

### 2. Templates → Content (One-to-Many)

**Relationship Type**: One-to-Many (1:N)  
**Foreign Key**: `content.templateId` references `templates.templateId`

**Why This Relationship Exists**:
- **Content Categorization**: Links content to specific template types
- **Template Usage Tracking**: Enables analytics on template popularity
- **Content Structure**: Ensures consistent content format
- **Filtering**: Allows content filtering by template type

**Constraints**:
- `content.templateId` must reference a valid `templates.templateId`
- Only active templates can be used for content generation
- Template deletion affects content categorization

**Usage Examples**:
```javascript
// Get content by template type
const socialMediaPosts = await contentModel.find({ 
    templateId: "TR348RU39R" 
});

// Template usage analytics
const templateUsage = await contentModel.aggregate([
    { $group: { _id: "$templateId", count: { $sum: 1 } } }
]);
```

---

## Index Strategy

### Primary Indexes

#### Users Collection
- **`userId`**: Unique index for fast user lookups
- **`email`**: Index for email-based authentication
- **`googleId`**: Index for Google OAuth authentication

#### Content Collection
- **`userId + contentId`**: Compound index for user-specific content queries
- **`createdAt`**: Descending index for chronological ordering
- **`title`**: Index for content search functionality
- **`content`**: Index for full-text content search
- **`category`**: Index for category-based filtering
- **`templateId`**: Index for template-based queries

#### Templates Collection
- **`templateId`**: Unique index for template lookups

### Performance Considerations

1. **Query Optimization**: Indexes support common query patterns
2. **Search Performance**: Text indexes enable efficient content search
3. **Pagination**: CreatedAt index supports efficient pagination
4. **User Isolation**: Compound indexes ensure user data isolation
5. **Template Queries**: TemplateId index supports template-based filtering

---

## Data Flow and Usage Patterns

### 1. User Registration Flow
```
Google OAuth → User Creation → userId Generation → User Record Stored
```

### 2. Content Generation Flow
```
User Input → Template Selection → AI Generation → Content Storage → Template Usage Update
```

### 3. Content Management Flow
```
Content Retrieval → User Validation → Content Operations → Data Updates
```

### 4. Analytics Flow
```
Data Collection → Aggregation → Usage Statistics → Template Popularity
```

---

## Security and Data Integrity

### 1. User Data Isolation
- All content queries must include `userId`
- Users can only access their own content
- Foreign key constraints ensure data integrity

### 2. Soft Delete Strategy
- Uses `isDeleted` flags instead of hard deletes
- Maintains referential integrity
- Enables data recovery if needed

### 3. Input Validation
- Mongoose schemas enforce data types
- Required fields prevent incomplete data
- Default values ensure data consistency

### 4. Authentication Integration
- Google OAuth integration for secure authentication
- User sessions managed through JWT tokens
- Role-based access control

---

## Maintenance and Optimization

### 1. Regular Maintenance
- Monitor index usage and performance
- Archive old content for performance
- Regular database backups
- Template usage analytics

### 2. Performance Optimization
- Use indexed fields for filtering and sorting
- Implement pagination for large result sets
- Optimize queries for common patterns
- Monitor query performance

### 3. Data Growth Management
- Implement content archiving strategies
- Monitor database size and growth
- Plan for horizontal scaling
- Optimize storage usage

---

This detailed schema documentation provides comprehensive understanding of the database structure, relationships, and usage patterns for the AI CMS Backend system. 