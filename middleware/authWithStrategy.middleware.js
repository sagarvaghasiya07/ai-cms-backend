const { error } = require('../common/res.common');
const { http_codes, messages } = require('../constant/text.constant');
const userModel = require('../model/user.model');
const { generateToken } = require('../utils/utils');
const passport = require("passport")

const googleAuth = async (req, res, next) => {
    passport.authenticate('google-local', async (err, user, info) => {
        if (err) {
            return error({ code: http_codes.unAuthorized, data: {}, msg: err, res })
        }
        if (!user) {
            return error({ code: http_codes.unAuthorized, data: {}, msg: info.message, res })
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