const mongoose = require('mongoose');
const { Schema } = require('mongoose');
const { schemas, defaultTemplates } = require('../constant/text.constant');

const templateSchema = new Schema({
    templateId: {
        type: String,
        required: true,
        index: true
    },
    name: {
        type: String,
        required: true
    },
    templateFormet: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
    usedCount: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
})

// Index for email and googleId
userSchema.index({ templateId: 1 });

const templateModel = mongoose.model(schemas.template, templateSchema);

const addDefaultTemplates = async () => {
    const count = await templateModel.countDocuments();
    if (count === 0) {
        await templateModel.insertMany(defaultTemplates);
    }
}

templateModel.countDocuments().then((data) => {
    if (data == 0) {
        console.log("no data")
        addDefaultTemplates()
    }
})

module.exports = templateModel;