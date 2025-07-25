const mongoose = require('mongoose');
const { Schema } = require('mongoose');
const { schemas } = require('../constant/text.constant');
const { generateRandomPublicId } = require('../utils/utils');

let contentSchema = new Schema({
    contentId: {
        type: String,
        unique: true
    },
    userId: {
        type: String,
        required: true
    },
    prompt: {
        type: String,
        required: true
    },
    templateId: {
        type: String,
        required: true
    },
    wholeContent: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    category: {
        type: String,
    },
    keywords: [{
        type: String
    }],
    tags: [{
        type: String
    }],
    aiProvider: {
        type: String,
        default: 'groq'
    },
    isEdited: {
        type: Boolean,
        default: false
    },
    isRegenerated: {
        type: Boolean,
        default: false
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});


contentSchema.pre("save", async function (next) {
    this.contentId = generateRandomPublicId("C", 9)
    next()
})

// Index for search functionality
contentSchema.index({ userId: 1, contentId: 1 });
contentSchema.index({ createdAt: -1 });
contentSchema.index({ title: 1 });
contentSchema.index({ content: 1 });
contentSchema.index({ category: 1 });
contentSchema.index({ templateId: 1 });

let contentModel = mongoose.model(schemas.content, contentSchema);

module.exports = contentModel; 