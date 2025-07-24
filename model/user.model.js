const mongoose = require('mongoose');
const { Schema } = require('mongoose');
const { schemas } = require('../constant/text.constant');
const { utcTime } = require('../utils/utils');

let userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    profile_url: {
        type: String,
        required: true
    },
    googleId: {
        type: String
    },
    singUpType: {
        type: String
    },
    lastLogin: {
        type: Date,
        default: utcTime()
    },
    isActive: {
        type: Boolean,
        default: true
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

// Index for email and googleId
userSchema.index({ email: 1 });
userSchema.index({ googleId: 1 });

let userModel = mongoose.model(schemas.user, userSchema);

module.exports = userModel