const jwt = require('jsonwebtoken');
const { http_codes, messages } = require("../constant/text.constant");
const { error } = require("../common/res.common");
const userModel = require("../model/user.model");

const SECRET_KEY = process.env.JWT_SECRET || 'your-secret-key';

const authMiddleware = async (req, res, next) => {
    try {
        let Auth = req.headers['authorization']
        if (Auth && Auth.split(" ")[0] === 'Bearer') {
            Auth = Auth.split(" ")[1]
            req.token = jwt.verify(Auth, SECRET_KEY)
            const userDetail = await userModel.findOne({ userId: req.token.userId })
            req.user = userDetail

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
            next()
        } else {
            return error({
                code: http_codes.unAuthorized,
                message: messages.invalidToken,
                res
            })
        }
    } catch (err) {
        console.log("catch error:", err);
        return error({
            code: http_codes.internalError,
            message: err.message,
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