const { DEBUG } = process.env;

function success({ code, data, message, res, extra }) {
    return res.status(code).json(
        {
            code: code,
            message: message,
            data: data,
            ...extra
        }
    )
}

function error({ code, message, res, extra, error, req, method = null }) {
    let errResp = {
        code: code,
        error: {
            message: message,
            extra
        }
    }
    if (DEBUG === 'true') {
        errResp.error.stack = error?.stack
        errResp.error.method = method
    }
    return res.status(code).json(errResp)
}

module.exports = {
    success,
    error
}