const jwt = require('jsonwebtoken');
const { http_codes, messages } = require("../constant/text.constant");
const { error } = require("../common/res.common");
const userModel = require("../model/user.model");

const { JWT_SECRET } = process.env;

const authMiddleware = async (req, res, next) => {
    try {
        let Auth = req.headers['authorization']

        if (!Auth) {
            return error({
                code: http_codes.unAuthorized,
                message: messages.authorizationHeaderRequired,
                res
            })
        }

        const tokenParts = Auth.split(" ");
        if (tokenParts.length !== 2 || tokenParts[0] !== 'Bearer') {
            return error({
                code: http_codes.unAuthorized,
                message: messages.invalidTokenFormat,
                res
            })
        }

        const token = tokenParts[1];

        if (!token || token.trim() === '') {
            return error({
                code: http_codes.unAuthorized,
                message: messages.tokenCannotBeEmpty,
                res
            })
        }

        try {
            req.token = jwt.verify(token, JWT_SECRET);
        } catch (jwtError) {
            let errorMessage = "Invalid token";
            let statusCode = http_codes.unAuthorized;

            if (jwtError.name === 'TokenExpiredError') {
                errorMessage = messages.tokenExpired;
                statusCode = http_codes.unAuthorized;
            } else if (jwtError.name === 'JsonWebTokenError') {
                errorMessage = messages.tokenSignatureInvalid;
                statusCode = http_codes.unAuthorized;
            } else if (jwtError.name === 'NotBeforeError') {
                errorMessage = messages.tokenNotActive;
                statusCode = http_codes.unAuthorized;
            } else if (jwtError.name === 'SyntaxError') {
                errorMessage = messages.malformedToken;
                statusCode = http_codes.badRequest;
            }

            return error({
                code: statusCode,
                message: errorMessage,
                res
            })
        }

        if (!req.token || !req.token.userId) {
            return error({
                code: http_codes.unAuthorized,
                message: messages.tokenPayloadInvalid,
                res
            })
        }

        const userDetail = await userModel.findOne({ userId: req.token.userId })

        if (!userDetail) {
            return error({
                code: http_codes.badRequest,
                message: messages.userNotFound,
                res
            })
        }

        if (userDetail.isActive === false) {
            return error({
                code: http_codes.badRequest,
                message: messages.accountInactive,
                res
            })
        }

        if (userDetail.passwordChangedAt && req.token.iat) {
            const passwordChangedTime = Math.floor(userDetail.passwordChangedAt.getTime() / 1000);
            if (req.token.iat < passwordChangedTime) {
                return error({
                    code: http_codes.unAuthorized,
                    message: messages.tokenIssuedBeforePasswordChange,
                    res
                })
            }
        }

        req.user = userDetail;
        next();

    } catch (err) {
        console.log("catch error:", err);
        return error({
            code: http_codes.internalError,
            message: messages.internalError,
            res,
            error: err,
            method: "authMiddleware",
            req
        })
    }
}

module.exports = {
    authMiddleware
}