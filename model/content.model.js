const mongoose = require('mongoose');
const { Schema } = require('mongoose');
const { schemas } = require('../constant/text.constant');

let contentSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: schemas.user,
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
        enum: ['social_media', 'email_subject', 'product_description', 'blog_post', 'ad_copy'],
        required: true
    },
    template: {
        type: String,
        required: true
    },
    keywords: [{
        type: String
    }],
    tags: [{
        type: String
    }],
    aiProvider: {
        type: String,
        enum: ['openai', 'huggingface', 'groq'],
        default: 'openai'
    },
    prompt: {
        type: String,
        required: true
    },
    isPublic: {
        type: Boolean,
        default: false
    },
    usageCount: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

// Index for search functionality
contentSchema.index({ title: 'text', content: 'text', keywords: 'text' });
contentSchema.index({ user: 1, category: 1 });
contentSchema.index({ createdAt: -1 });

let contentModel = mongoose.model(schemas.content, contentSchema);

module.exports = contentModel; 