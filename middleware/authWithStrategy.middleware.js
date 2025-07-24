const { error } = require('../common/res.common');
const { http_codes, messages } = require('../constant/text.constant');
const userModel = require('../model/user.model');
const { generateToken } = require('../utils/utils');
const passport = require("passport")

const googleAuth = async (req, res, next) => {

    passport.authenticate('google-jwt', async (err, user, info) => {

        if (err) {
            console.log("Authentication error:", err);

            // Handle structured error objects from passport strategy
            const errorMessage = err.message || err;
            const errorCode = err.code || 'AUTHENTICATION_FAILED';

            return error({
                code: http_codes.unAuthorized,
                data: {},
                message: errorMessage,
                extra: { errorCode },
                res
            })
        }

        if (!user) {
            const infoMessage = info?.message || "Authentication failed";
            return error({
                code: http_codes.unAuthorized,
                data: {},
                message: infoMessage,
                res
            })
        }

        const tokenData = {
            googleId: user.googleId,
            userId: user.userId,
            singUpType: user.singUpType
        }
        const token = generateToken(tokenData)
        req.token = token
        req.user = user
        next()
    })(req, res, next);
}

module.exports = {
    googleAuth
}