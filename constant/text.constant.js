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
    googleTokenRequired: 'Google access token is required for authentication.'
};

const schemas = {
    user: 'user'
}

module.exports = {
    http_codes,
    messages,
    schemas
};