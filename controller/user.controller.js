const { error, success } = require("../common/res.common");
const { http_codes, messages, defaultTemplates } = require("../constant/text.constant");
const userModel = require("../model/user.model");
const contentModel = require("../model/content.model");

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
            role: user.role,
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

const statastic = async (req, res) => {
    try {
        const { user } = req;
        const userDetail = await userModel.findOne({ userId: user.userId });
        if (!userDetail) {
            return error({
                code: http_codes.badRequest,
                message: messages.userNotFound,
                res
            })
        }

        // want this statsatics : 1. Total Content Generated, 2. total Content This Month, 3. total social media post generated, 4. total email generated, 5. total product description generated
        const all_stats = await Promise.allSettled([
            contentModel.countDocuments({ userId: user.userId, isDeleted: false }),
            contentModel.countDocuments({ userId: user.userId, isDeleted: false, createdAt: { $gte: new Date(new Date().setMonth(new Date().getMonth() - 1)) } }),
            contentModel.countDocuments({ userId: user.userId, isDeleted: false, templateId: defaultTemplates.find(template => template.name === 'Social Media Post').templateId }),
            contentModel.countDocuments({ userId: user.userId, isDeleted: false, templateId: defaultTemplates.find(template => template.name === 'Email Subject Line').templateId }),
            contentModel.countDocuments({ userId: user.userId, isDeleted: false, templateId: defaultTemplates.find(template => template.name === 'Product Descriptions').templateId })
        ])

        const totalContentGenerated = all_stats[0].status === 'fulfilled' ? all_stats[0].value : 0;
        const totalContentThisMonth = all_stats[1].status === 'fulfilled' ? all_stats[1].value : 0;
        const totalSocialMediaPostGenerated = all_stats[2].status === 'fulfilled' ? all_stats[2].value : 0;
        const totalEmailGenerated = all_stats[3].status === 'fulfilled' ? all_stats[3].value : 0;
        const totalProductDescriptionGenerated = all_stats[4].status === 'fulfilled' ? all_stats[4].value : 0;

        const stats = {
            totalContentGenerated,
            totalContentThisMonth,
            totalSocialMediaPostGenerated,
            totalEmailGenerated,
            totalProductDescriptionGenerated
        }

        return success({ code: http_codes.ok, data: stats, message: messages.statasticRetrieved, res })
    } catch (e) {
        console.log('Controller error:', e);
        return error({
            code: http_codes.internalError,
            message: e.message,
            res,
            error: e,
            method: "statastic",
            req
        });
    }
}

module.exports = {
    loginWithGoogle,
    getProfile,
    statastic
}