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
    accessTokenRequired: 'Access token is required'

};

const schemas = {
    user: 'user'
}

module.exports = {
    http_codes,
    messages,
    schemas
};