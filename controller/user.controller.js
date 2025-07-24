const { error, success } = require("../common/res.common");
const { http_codes, messages } = require("../constant/text.constant");
const userModel = require("../model/user.model");

const loginWithGoogle = async (req, res) => {
    try {
        const { token, user } = req;

        // get user detail from token
        const userDetail = await userModel.findOne({ userId: user.userId });

        if (!userDetail) {
            return error({
                code: http_codes.notFound,
                message: messages.userNotFound,
                res,
                method: "loginWithGoogle",
                req
            })
        }
        const userData = {
            userId: userDetail.userId,
            name: userDetail.name,
            email: userDetail.email,
            profile_url: userDetail.profile_url,
            singUpType: userDetail.singUpType,
            token: token
        }

        return success({ code: http_codes.ok, data: userData, message: messages.loginSuccess, res })
    } catch (err) {
        console.log("catch error:", err);
        return error({
            code: http_codes.internalError,
            message: err.message,
            res,
            error: err,
            method: "loginWithGoogle",
            req
        })
    }
}

const getProfile = async (req, res) => {
    try {
        const { user } = req;

        if (!user) {
            return error({
                code: http_codes.notFound,
                message: messages.userNotFound,
                res,
                method: "getProfile",
                req
            })
        }

        const userData = {
            userId: user.userId,
            name: user.name,
            profile_url: user.profile_url,
            email: user.email,
            singUpType: user.singUpType,
            lastLogin: user.lastLogin,
            createdAt: user.createdAt
        }

        return success({ code: http_codes.ok, data: userData, message: messages.profileRetrieved, res })
    } catch (err) {
        console.log("catch error:", err);
        return error({
            code: http_codes.internalError,
            message: err.message,
            res,
            error: err,
            method: "getProfile",
            req
        })
    }
}

module.exports = {
    loginWithGoogle,
    getProfile
}