const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Get user by Firebase UID
router.get('/user/:firebaseUid', authController.getUserByFirebaseUid);

// Verify member before signup
router.post('/verify-member', authController.verifyMember);

// Signup routes
router.post('/signup/admin', authController.signupAdmin);
router.post('/signup/member', authController.signupMember);

// User management
router.get('/users', authController.getAllUsers);
router.put('/users/:id', authController.updateUser);
router.put('/users/:id/deactivate', authController.deactivateUser);

module.exports = router;
