const Strategy = require('passport-strategy').Strategy;
const userModel = require("../model/user.model");
const passport = require("passport")
const { messages } = require('../constant/text.constant');
const axios = require('axios');

// Custom strategy for Google JWT authentication
class GoogleJWTStrategy extends Strategy {
    constructor(options, verify) {
        super();
        this.name = 'google-jwt';
        this.verify = verify;
    }

    authenticate(req, options) {

        // Get JWT token from request body
        const jwtToken = req.body.accessToken;

        if (!jwtToken) {
            console.log("No JWT token provided");
            return this.fail({ message: messages.googleTokenRequired });
        }

        // Call the verify function
        this.verify(req, jwtToken, (err, user, info) => {
            if (err) {
                console.log("Strategy verification error:", err);
                return this.fail(err);
            }
            if (!user) {
                return this.fail(info);
            }
            return this.success(user, info);
        });
    }
}

// Use the custom strategy
passport.use(new GoogleJWTStrategy({}, async function (req, jwtToken, done) {

    try {

        // Verify and decode the JWT token with Google
        const response = await axios.get(`https://oauth2.googleapis.com/tokeninfo?id_token=${jwtToken}`);
        const userInfo = response.data;

        // Find existing user by email
        const userDetail = await userModel.findOne({ email: userInfo.email });
        if (!userDetail) {
            // Create new user account
            const userObj = {
                googleId: userInfo.sub,
                email: userInfo.email,
                name: userInfo.name,
                profile_url: userInfo.picture,
                singUpType: 'google'
            }
            const newUser = await userModel(userObj).save()
            return done(null, newUser, {});
        }

        // Update existing user with Google info
        const updatedDetail = await userModel.findOneAndUpdate(
            { _id: userDetail._id },
            {
                $set: {
                    googleId: userInfo.sub,
                    name: userInfo.name,
                    profile_url: userInfo.picture,
                    singUpType: 'google',
                    lastLogin: new Date()
                }
            },
            { new: true }
        )
        return done(null, updatedDetail, {});

    } catch (e) {
        console.log("Full error:", e);

        // Handle different types of errors with specific messages
        if (e?.response?.status === 400) {
            const errorMessage = e?.response?.data?.error_description || messages.googleTokenInvalid;
            return done({ message: errorMessage, code: 'INVALID_TOKEN' }, null, {});
        }

        if (e?.response?.status === 401) {
            return done({ message: messages.googleTokenExpired, code: 'TOKEN_EXPIRED' }, null, {});
        }

        if (e?.response?.status === 403) {
            return done({ message: messages.googleAccessDenied, code: 'ACCESS_DENIED' }, null, {});
        }

        if (e?.code === 'ECONNREFUSED' || e?.code === 'ENOTFOUND') {
            return done({ message: messages.googleConnectionError, code: 'CONNECTION_ERROR' }, null, {});
        }

        // Default error message
        const errorMessage = e?.response?.data?.error_description ||
            e?.response?.data?.error ||
            e?.message ||
            messages.googleAuthFailed;

        return done({ message: errorMessage, code: 'AUTHENTICATION_FAILED' }, null, {});
    }
}));