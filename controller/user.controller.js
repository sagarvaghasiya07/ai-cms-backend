const { error, success } = require("../common/res.common");
const { http_codes, messages } = require("../constant/text.constant");

const loginWithGoogle = async (req, res) => {
    try {
        const { token } = req

        return success({
            code: http_codes.ok,
            data: { token: token },
            message: messages.loginSuccess,
            res
        })
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



module.exports = {
    loginWithGoogle
}