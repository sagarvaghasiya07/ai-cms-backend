const express = require('express');
const router = express.Router();
const controller = require('../controller');
const { googleAuth } = require('../middleware/authWithStrategy.middleware');
const { authMiddleware } = require('../middleware/auth.middleware');

router.route("/auth/google").post(googleAuth, controller.loginWithGoogle)
router.route("/getProfile").get(authMiddleware, controller.getProfile)

module.exports = router;