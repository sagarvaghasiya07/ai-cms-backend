const express = require('express');
const { authMiddleware } = require('../middleware/auth.middleware');
const controller = require('../controller/content.controller');

const router = express.Router();

// Get template list
router.get('/ai/get-template-list', controller.templateList);

// Generate AI content
router.post('/ai/generate-content', authMiddleware, controller.generateContent);
router.post('/ai/regenerate-content', authMiddleware, controller.regenerateContent);
router.get('/ai/get-content-list', authMiddleware, controller.getContentList);
router.get('/ai/get-content-detail', authMiddleware, controller.getContentDetails);
router.post('/ai/edit-content', authMiddleware, controller.editContent);

module.exports = router; 