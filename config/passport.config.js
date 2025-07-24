const LocalStrategy = require('passport-local').Strategy;
const userModel = require("../model/user.model");
const passport = require("passport")
const { messages } = require('../constant/text.constant');
const axios = require('axios');

passport.use('google-local', new LocalStrategy({ usernameField: 'accessToken', passwordField: 'optional' },
    async function (accessToken, optional, done) {
        try {
            if (!accessToken) {
                return done(null, null, { message: messages.accessTokenRequired });
            }

            // Check if it's an ID token (JWT format) or access token
            if (accessToken.split('.').length === 3) {
                // It's an ID token, verify it with Google
                const response = await axios.get(`https://oauth2.googleapis.com/tokeninfo?id_token=${accessToken}`);
                const userInfo = response.data;
                
                const userDetail = await userModel.findOne({ email: userInfo.email });

                if (!userDetail) {
                    const userObj = {
                        googleId: userInfo.sub,
                        email: userInfo.email,
                        profile_url: userInfo.picture,
                        singUpType: 'google'
                    }
                    const newUser = await userModel(userObj).save()
                    return done(null, newUser, {});
                }
                if (userDetail && userDetail?.singUpType === 'google') {
                    const updatedDetail = await userModel.findOneAndUpdate(
                        { userId: userDetail.userId },
                        {
                            $set: { googleId: userInfo.sub },
                            $addToSet: { singUpType: 'google' }
                        },
                        { new: true }
                    )
                    return done(null, updatedDetail, {})
                }
                return done(null, userDetail, {});
            } else {
                // It's an access token, use the original logic
                const fetchUserDetail = await axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${accessToken}`)
                const emailDetail = fetchUserDetail.data

                const userDetail = await userModel.findOne({ email: emailDetail.email });

                if (!userDetail) {
                    const userObj = {
                        googleId: emailDetail.id,
                        email: emailDetail.email,
                        profile_url: emailDetail.picture,
                        singUpType: 'google'
                    }
                    const newUser = await userModel(userObj).save()
                    return done(null, newUser, {});
                }
                if (userDetail && userDetail?.singUpType === 'google') {
                    const updatedDetail = await userModel.findOneAndUpdate(
                        { userId: userDetail.userId },
                        {
                            $set: { googleId: emailDetail.id },
                            $addToSet: { singUpType: 'google' }
                        },
                        { new: true }
                    )
                    return done(null, updatedDetail, {})
                }
                return done(null, userDetail, {});
            }
        } catch (e) {
            console.log("passport config error:", e);
            console.log("error:", e?.response?.data?.error);
            return done(e?.response?.data?.error?.message || e.message, null, {});
        }
    }
));