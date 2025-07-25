const http_codes = {
    badRequest: 400,
    internalError: 500,
    created: 201,
    notFound: 404,
    ok: 200,
    notImplemented: 501,
    forbidden: 403,
    unAuthorized: 401,
};

const messages = {
    internalError: 'Internal server error',
    notFound: 'Not found',
    ok: 'OK',
    notImplemented: 'Not implemented',
    forbidden: 'Forbidden',
    unAuthorized: 'Unauthorized',
    routeNotFound: 'Route not found',
    loginSuccess: 'Login successful',
    accessTokenRequired: 'Access token is required',
    userNotFound: 'User not found',
    accountInactive: 'Account is inactive',
    invalidToken: 'Invalid token',
    profileRetrieved: 'Profile retrieved successfully',
    // Google OAuth specific messages
    googleTokenInvalid: 'Invalid Google token. Please try signing in again.',
    googleTokenExpired: 'Google token has expired. Please sign in again.',
    googleAccessDenied: 'Access denied. Please check your Google OAuth configuration.',
    googleConnectionError: 'Unable to connect to Google services. Please try again later.',
    googleAuthFailed: 'Google authentication failed. Please try again.',
    googleTokenRequired: 'Google access token is required for authentication.',
    promptRequired: 'Prompt is required',
    contentGenerationFailed: 'Content generation failed',
    contentGeneratedSuccessfully: 'Content generated successfully',
    contentRetrieved: 'Content retrieved successfully',
    invalidTemplate: 'Invalid template provided',
    invalidCategory: 'Invalid category provided',
    contentNotFound: 'Content not found',
    userIdRequired: 'User ID is required',
    invalidTemplateId: 'Invalid template ID provided',
    templateNotFound: 'Template not found',
    userNotAuthorized: 'User not authorized',
    contentListRetrieved: 'Content list retrieved successfully',
    contentDetailsRetrieved: 'Content details retrieved successfully',
    contentIdRequired: 'Content ID is required',
    contentUpdatedSuccessfully: 'Content updated successfully',
    contentNotUpdated: 'Content not updated',
    contentDeletedSuccessfully: 'Content deleted successfully',
    contentNotDeleted: 'Content not deleted',
    contentRegeneratedSuccessfully: 'Content regenerated successfully',
    templateNotFound: 'Template not found',
    templateListRetrieved: 'Template list retrieved successfully',
    statasticRetrieved: 'Statastic retrieved successfully',
    authorizationHeaderRequired: 'Authorization header is required',
    invalidTokenFormat: 'Invalid token format. Use "Bearer <token>"',
    tokenExpired: 'Token has expired',
    tokenSignatureInvalid: 'Invalid token signature',
    tokenNotActive: 'Token not active yet',
    malformedToken: 'Malformed token',
    tokenCannotBeEmpty: 'Token cannot be empty',
    tokenPayloadInvalid: 'Token payload is invalid or missing required fields',
    tokenIssuedBeforePasswordChange: 'Token was issued before password change. Please login again'
};

const schemas = {
    user: 'user',
    content: 'content',
    template: 'template'
}

const defaultTemplates = [
    {
        templateId: 'TR348RU39R',
        name: 'Social Media Post',
        templateFormet: `Create a social media post about: {{userInput}}
        
        Please provide your response in the following structured format:
        
        Title: [Give a catchy title for this post]
        Category: [Specify the category like Marketing, Lifestyle, Business, etc.]
        Keywords: [List 3-5 relevant keywords separated by commas]
        Content: [Write the actual social media post content]
        Tags: [Add 3-5 hashtags starting with #]`,
        description: 'Create a social media post about the user input'
    },
    {
        templateId: 'TE23R82U33',
        name: 'Email Subject Line',
        templateFormet: `Create a social media post about: {{userInput}}

Please provide your response in the following structured format:

Title: [Give a catchy title for this post]
Category: [Specify the category like Marketing, Lifestyle, Business, etc.]
Keywords: [List 3-5 relevant keywords separated by commas]
Content: [Write the actual social media post content]
Tags: [Add 3-5 hashtags starting with #]`,
        description: 'Create a social media post about the user input'
    },
    {
        templateId: 'T349RU3984',
        name: 'Product Descriptions',
        templateFormet: `Write a product description for: {{userInput}}

Please provide your response in the following structured format:

Title: [Give a title for this product description]
Category: [Specify the category like E-commerce, Technology, Fashion, etc.]
Keywords: [List 3-5 relevant keywords separated by commas]
Content: [Write the compelling product description]
Tags: [Add 3-5 hashtags starting with #]`,
        description: 'Write a product description for the user input'
    }
]

module.exports = {
    http_codes,
    messages,
    schemas,
    defaultTemplates
};