import { Router } from 'express';
const router = Router();
import { register, registerSeller, login, refreshToken, logout, forgotPassword, resetPassword, getMe, updateProfile, changePassword } from '../Controllers/authController.js';
import { protect } from '../Middleware/auth.js';
import { authLimiter } from '../Middleware/rateLimiter.js';
// import { upload } from '../config/cloudinary';

// Public
router.post('/register', authLimiter, register);
router.post('/register/seller', authLimiter, registerSeller);
router.post('/login', authLimiter, login);
router.post('/refresh', refreshToken);
router.post('/logout', logout);
router.post('/forgot-password', authLimiter, forgotPassword);
router.patch('/reset-password/:token', resetPassword);

// Protected
router.get('/me', protect, getMe);
// router.patch('/me',              protect, upload.single('profilePic'), updateProfile);
router.patch('/change-password', protect, changePassword);

export default router;
