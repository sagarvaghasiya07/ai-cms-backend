const { JWT_SECRET, ACCESS_TOKEN_EXPIRY } = process.env
const jwt = require('jsonwebtoken');
const moment = require('moment-timezone');

const generateToken = (payload, expiresIn = ACCESS_TOKEN_EXPIRY) => {
    return jwt.sign(payload, JWT_SECRET, { expiresIn });
}

const utcTime = (time) => {
    let currentTime = time ? time : new Date();
    return new Date(moment.tz(currentTime, "Asia/Kolkata").tz("Atlantic/Reykjavik").format())
};

const generateRandomPublicId = (key, length = 9) => {
    let result = '';
    const characters = '0123456789';

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        result += characters[randomIndex];
    }

    return key + result;
}

module.exports = {
    generateToken,
    utcTime,
    generateRandomPublicId
}