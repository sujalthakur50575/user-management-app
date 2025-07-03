const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { uploadMiddleware } = require('../middleware/upload');

// CRUD routes
router.get('/', userController.getAllUsers);
router.get('/stats', userController.getUserStats);
router.get('/search', userController.searchUsers);
router.post('/', userController.createUser);
router.get('/:id', userController.getUserById);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);

// Excel-related routes
router.get('/excel/template', userController.downloadTemplate);
router.get('/excel/export', userController.exportUsers);
router.post('/excel/upload', uploadMiddleware, userController.bulkUploadUsers);

module.exports = router;
