const express = require('express');
const router = express.Router();
const controller = require('../controller');
const { googleAuth } = require('../middleware/authWithStrategy.middleware');
const { authMiddleware } = require('../middleware/auth.middleware');

router.route("/auth/google").post(googleAuth, controller.loginWithGoogle)
router.route("/get-profile").get(authMiddleware, controller.getProfile)
router.route("/get-statastic").get(authMiddleware, controller.statastic)

module.exports = router;