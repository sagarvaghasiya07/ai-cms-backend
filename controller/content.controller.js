const { error, success } = require("../common/res.common");
const { http_codes, messages } = require("../constant/text.constant");
const { generategroqContent } = require("../services/groq.service");
const contentModel = require("../model/content.model");
const templateModel = require("../model/template.model");
const userModel = require("../model/user.model");
const { utcTime } = require("../utils/utils");

const templateList = async (req, res) => {
    try {
        const templateList = await templateModel.find({ isActive: true }).select('-_id templateId name');
        if (!templateList.length) {
            return error({
                code: http_codes.badRequest,
                message: messages.templateNotFound,
                res
            })
        }
        return success({
            code: http_codes.ok,
            data: templateList,
            message: messages.templateListRetrieved,
            res
        })
    } catch (e) {
        console.log('Controller error:', e);
        return error({
            code: http_codes.internalError,
            message: e.message,
            res,
            error: e,
            method: "templateList",
            req
        });
    }
};

const generateContent = async (req, res) => {
    try {
        const { userInput, templateId } = req.body;
        const { userId } = req.token;

        const userDetail = await userModel.findOne({ userId, isActive: true });
        if (!userDetail) {
            return error({
                code: http_codes.badRequest,
                message: messages.userNotFound,
                req,
                res
            })
        }

        let prompt;
        if (!templateId) {
            return error({
                code: http_codes.badRequest,
                message: messages.invalidTemplateId,
                req,
                res
            })
        }
        const template = await templateModel.findOne({ templateId });
        if (!template) {
            return error({
                code: http_codes.badRequest,
                message: messages.templateNotFound,
                req,
                res
            })
        }
        prompt = template.templateFormet.replace('{{userInput}}', userInput);
        try {
            const content = await generategroqContent(prompt);

            // Extract structured fields from the response
            const lines = content.split('\n');
            let title = '';
            let category = '';
            let keywords = [];
            let tags = [];
            let mainContent = '';

            for (let line of lines) {
                line = line.trim();
                if (line.startsWith('**Title:**') || line.startsWith('Title:')) {
                    title = line.replace('**Title:**', '').replace('Title:', '').trim();
                } else if (line.startsWith('**Category:**') || line.startsWith('Category:')) {
                    category = line.replace('**Category:**', '').replace('Category:', '').trim();
                } else if (line.startsWith('**Keywords:**') || line.startsWith('Keywords:')) {
                    const keywordsStr = line.replace('**Keywords:**', '').replace('Keywords:', '').trim();
                    keywords = keywordsStr.split(',').map(k => k.trim()).filter(k => k);
                } else if (line.startsWith('**Tags:**') || line.startsWith('Tags:')) {
                    const tagsStr = line.replace('**Tags:**', '').replace('Tags:', '').trim();
                    tags = tagsStr.split(' ').filter(tag => tag.startsWith('#')).map(tag => tag.replace('#', ''));
                } else if (line.startsWith('**Content:**') || line.startsWith('Content:')) {
                    // Get all content after "Content:" until the next section
                    const contentIndex = lines.indexOf(line);
                    const contentLines = lines.slice(contentIndex + 1);

                    // Find where the content ends (before the next section)
                    let endIndex = contentLines.length;
                    for (let i = 0; i < contentLines.length; i++) {
                        const contentLine = contentLines[i].trim();
                        if (contentLine.startsWith('**Tags:**') || contentLine.startsWith('Tags:') ||
                            contentLine.startsWith('**Title:**') || contentLine.startsWith('Title:') ||
                            contentLine.startsWith('**Category:**') || contentLine.startsWith('Category:') ||
                            contentLine.startsWith('**Keywords:**') || contentLine.startsWith('Keywords:')) {
                            endIndex = i;
                            break;
                        }
                    }

                    mainContent = contentLines.slice(0, endIndex).join('\n').trim();

                    // Additional check to remove any remaining "**Content:**" or "Content:" from the extracted content
                    mainContent = mainContent.replace(/^\*\*Content:\*\*\s*/, '').replace(/^Content:\s*/, '');
                    break;
                }
            }

            // If structured parsing failed, fallback to original method
            if (!title) {
                title = 'Generated Content';
            }
            if (!category) {
                category = 'General';
            }
            if (keywords.length === 0) {
                keywords = content.match(/\b\w+\b/g)?.slice(0, 5) || [];
            }
            if (tags.length === 0) {
                tags = content.match(/#(\w+)/g)?.map(tag => tag.replace('#', '')) || [];
            }
            if (!mainContent) {
                mainContent = content;
            }

            const contentObj = {
                userId,
                title,
                wholeContent: content,
                content: mainContent,
                templateId,
                prompt,
                category,
                keywords,
                tags,
                aiProvider: 'groq'
            }
            const contentData = await contentModel.create(contentObj);

            // update usedCount of template
            await templateModel.updateOne({ templateId }, { $inc: { usedCount: 1 } });

            return success({
                code: http_codes.ok,
                data: contentData,
                message: messages.contentGeneratedSuccessfully,
                res
            })
        } catch (err) {
            console.log('err:::::::::', err);
            return error({
                code: http_codes.internalError,
                message: err.message || messages.contentGenerationFailed,
                req,
                res
            })
        }
    } catch (e) {
        console.log('Controller error:', e);
        return error({
            code: http_codes.internalError,
            message: err.message,
            res,
            error: err,
            method: "generateContent",
            req
        });
    }
};

const regenerateContent = async (req, res) => {
    try {
        const { userId } = req.token;
        const { contentId, userInput } = req.body;

        const userDetail = await userModel.findOne({ userId, isActive: true });
        if (!userDetail) {
            return error({
                code: http_codes.badRequest,
                message: messages.userNotFound,
                res
            })
        }

        const contentDetails = await contentModel.findOne({ contentId, userId });
        if (!contentDetails) {
            return error({
                code: http_codes.badRequest,
                message: messages.contentNotFound,
                res
            })
        }

        let prompt = contentDetails.prompt.replace('{{userInput}}', userInput);
        prompt = prompt + '\n\n' + "regenerate based on old whole responce and new suggestions: " + contentDetails.wholeContent;
        const content = await generategroqContent(prompt);

        // Extract structured fields from the response
        const lines = content.split('\n');
        let title = '';
        let category = '';
        let keywords = [];
        let tags = [];
        let mainContent = '';

        for (let line of lines) {
            line = line.trim();
            if (line.startsWith('**Title:**') || line.startsWith('Title:')) {
                title = line.replace('**Title:**', '').replace('Title:', '').trim();
            } else if (line.startsWith('**Category:**') || line.startsWith('Category:')) {
                category = line.replace('**Category:**', '').replace('Category:', '').trim();
            } else if (line.startsWith('**Keywords:**') || line.startsWith('Keywords:')) {
                const keywordsStr = line.replace('**Keywords:**', '').replace('Keywords:', '').trim();
                keywords = keywordsStr.split(',').map(k => k.trim()).filter(k => k);
            } else if (line.startsWith('**Tags:**') || line.startsWith('Tags:')) {
                const tagsStr = line.replace('**Tags:**', '').replace('Tags:', '').trim();
                tags = tagsStr.split(' ').filter(tag => tag.startsWith('#')).map(tag => tag.replace('#', ''));
            } else if (line.startsWith('**Content:**') || line.startsWith('Content:')) {
                // Get all content after "Content:" until the next section
                const contentIndex = lines.indexOf(line);
                const contentLines = lines.slice(contentIndex + 1);

                // Find where the content ends (before the next section)
                let endIndex = contentLines.length;
                for (let i = 0; i < contentLines.length; i++) {
                    const contentLine = contentLines[i].trim();
                    if (contentLine.startsWith('**Tags:**') || contentLine.startsWith('Tags:') ||
                        contentLine.startsWith('**Title:**') || contentLine.startsWith('Title:') ||
                        contentLine.startsWith('**Category:**') || contentLine.startsWith('Category:') ||
                        contentLine.startsWith('**Keywords:**') || contentLine.startsWith('Keywords:')) {
                        endIndex = i;
                        break;
                    }
                }

                // Extract only the content part, excluding the "Content:" header
                mainContent = contentLines.slice(0, endIndex).join('\n').trim();

                // Additional check to remove any remaining "**Content:**" or "Content:" from the extracted content
                mainContent = mainContent.replace(/^\*\*Content:\*\*\s*/, '').replace(/^Content:\s*/, '');
                break;
            }
        }
        console.log('mainContent:::::::::', mainContent);
        // If structured parsing failed, fallback to original method
        if (!title) {
            title = 'Generated Content';
        }
        if (!category) {
            category = 'General';
        }
        if (keywords.length === 0) {
            keywords = content.match(/\b\w+\b/g)?.slice(0, 5) || [];
        }
        if (tags.length === 0) {
            tags = content.match(/#(\w+)/g)?.map(tag => tag.replace('#', '')) || [];
        }
        if (!mainContent) {
            mainContent = content;
        }

        const contentObj = {
            title,
            wholeContent: content,
            content: mainContent,
            templateId: contentDetails.templateId,
            prompt,
            category,
            keywords,
            tags,
            aiProvider: 'groq',
            isRegenerated: true
        }
        const contentData = await contentModel.findOneAndUpdate({ contentId }, { $set: contentObj }, { new: true });

        return success({
            code: http_codes.ok,
            data: contentData,
            message: messages.contentRegeneratedSuccessfully,
            res
        })
    } catch (e) {
        console.log('Controller error:', e);
        return error({
            code: http_codes.internalError,
            message: e.message,
            res,
            error: e,
            method: "regenerateContent",
            req
        });
    }
};

const getContentList = async (req, res) => {
    try {
        const { userId } = req.token;
        const { page, limit, search, category, templateId } = req.query;

        const perPage = parseInt(limit) || 10;
        const pages = typeof page != "undefined" ? page == 0 ? 1 : page || 1 : 1;
        const skip = perPage * pages - perPage;

        const userDetail = await userModel.findOne({ userId, isActive: true });
        if (!userDetail) {
            return error({
                code: http_codes.badRequest,
                message: messages.userNotFound,
                res
            })
        }

        if (userDetail.role !== 'Content Creator') {
            return error({
                code: http_codes.badRequest,
                message: messages.userNotAuthorized,
                res
            })
        }

        let wh = {
            userId: userId,
            isDeleted: false
        }
        if (search) {
            wh['$or'] = [
                { title: { $regex: search, $options: 'i' } },
                { content: { $regex: search, $options: 'i' } }
            ]
        }
        if (category) {
            wh['category'] = category
        }
        if (templateId) {
            wh['templateId'] = templateId
        }

        let agg = [
            {
                $match: wh
            },
            {
                $sort: {
                    createdAt: -1
                }
            },
            {
                $skip: skip
            },
            {
                $limit: perPage
            },
            {
                $lookup: {
                    from: 'templates',
                    localField: 'templateId',
                    foreignField: 'templateId',
                    as: 'template'
                }
            },
            {
                $unwind: '$template'
            },
            {
                $project: {
                    _id: 0,
                    contentId: 1,
                    userId: 1,
                    title: 1,
                    content: 1,
                    createdAt: 1,
                    templateDetails: {
                        templateId: "$template.templateId",
                        name: "$template.name"
                    },
                    category: 1,
                    keywords: 1,
                    tags: 1,
                    aiProvider: 1
                }
            }
        ]
        const contentList = await contentModel.aggregate(agg);
        const contentCount = await contentModel.countDocuments(wh);

        let data = {}
        data['list'] = contentList
        data['current'] = parseInt(pages) || 1;
        data['pages'] = Math.ceil(contentCount / perPage);
        data['totalitems'] = contentCount

        return success({
            code: http_codes.ok,
            data: data,
            message: messages.contentListRetrieved,
            res
        })
    } catch (error) {
        console.log('Controller error:', error);
        return error({
            code: http_codes.internalError,
            message: err.message,
            res,
            error: err,
            method: "getContentList",
            req
        });
    }
};

const getContentDetails = async (req, res) => {
    try {
        const { userId } = req.token;
        const { contentId } = req.query;

        const userDetail = await userModel.findOne({ userId, isActive: true });
        if (!userDetail) {
            return error({
                code: http_codes.badRequest,
                message: messages.userNotFound,
                res
            })
        }

        const content = await contentModel.findOne({ contentId, userId });
        if (!content) {
            return error({
                code: http_codes.badRequest,
                message: messages.contentNotFound,
                res
            })
        }

        return success({
            code: http_codes.ok,
            data: content,
            message: messages.contentDetailsRetrieved,
            res
        })
    } catch (e) {
        console.log('Controller error:', e);
        return error({
            code: http_codes.internalError,
            message: e.message,
            res,
            error: e,
            method: "getContentDetails",
            req
        });
    }
};

const editContent = async (req, res) => {
    try {
        const { userId } = req.token;
        const { contentId, title, content, category, keywords, tags } = req.body;

        if (!contentId) {
            return error({
                code: http_codes.badRequest,
                message: messages.contentIdRequired,
                res
            })
        }

        const userDetail = await userModel.findOne({ userId, isActive: true });
        if (!userDetail) {
            return error({
                code: http_codes.badRequest,
                message: messages.userNotFound,
                res
            })
        }

        const contentData = await contentModel.findOne({ contentId, userId });
        if (!contentData) {
            return error({
                code: http_codes.badRequest,
                message: messages.contentNotFound,
                res
            })
        }

        let wh = {}
        if (title) {
            wh['title'] = title
        }
        if (content) {
            wh['content'] = content
        }
        if (category) {
            wh['category'] = category
        }
        if (keywords) {
            wh['keywords'] = keywords
        }
        if (tags) {
            wh['tags'] = tags
        }

        if (Object.keys(wh).length === 0) {
            return error({
                code: http_codes.badRequest,
                message: messages.contentNotUpdated,
                res
            })
        }
        wh['isEdited'] = true
        wh['updatedAt'] = utcTime()

        const updatedContent = await contentModel.findOneAndUpdate({ contentId, userId }, { $set: wh }, { new: true });
        if (!updatedContent) {
            return error({
                code: http_codes.badRequest,
                message: messages.contentNotUpdated,
                res
            })
        }
        return success({
            code: http_codes.ok,
            data: updatedContent,
            message: messages.contentUpdatedSuccessfully,
            res
        })
    } catch (e) {
        console.log('Controller error:', e);
        return error({
            code: http_codes.internalError,
            message: e.message,
            res,
            error: e,
            method: "editContent",
            req
        });
    }
};

const deleteContent = async (req, res) => {
    try {
        const { userId } = req.token;
        const { contentId } = req.query;

        if (!contentId) {
            return error({
                code: http_codes.badRequest,
                message: messages.contentIdRequired,
                res
            })
        }

        const userDetail = await userModel.findOne({ userId, isActive: true });
        if (!userDetail) {
            return error({
                code: http_codes.badRequest,
                message: messages.userNotFound,
                res
            })
        }

        const contentData = await contentModel.findOne({ contentId, userId });
        if (!contentData) {
            return error({
                code: http_codes.badRequest,
                message: messages.contentNotFound,
                res
            })
        }

        const deletedContent = await contentModel.findOneAndUpdate({ contentId, userId }, { $set: { isDeleted: true } }, { new: true });
        if (!deletedContent) {
            return error({
                code: http_codes.badRequest,
                message: messages.contentNotDeleted,
                res
            })
        }

        return success({
            code: http_codes.ok,
            data: deletedContent,
            message: messages.contentDeletedSuccessfully,
            res
        })
    } catch (e) {
        console.log('Controller error:', e);
        return error({
            code: http_codes.internalError,
            message: e.message,
            res,
            error: e,
            method: "deleteContent",
            req
        });
    }
};

module.exports = {
    templateList,
    generateContent,
    getContentList,
    getContentDetails,
    regenerateContent,
    editContent,
    deleteContent,
};