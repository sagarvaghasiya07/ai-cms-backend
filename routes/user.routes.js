const express = require('express');
const router = express.Router();
const controller = require('../controller');
const { googleAuth } = require('../middleware/authWithStrategy.middleware');

router.route("/auth/google").post(googleAuth, controller.loginWithGoogle)

module.exports = router;
