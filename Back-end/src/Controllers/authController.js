import { randomBytes, createHash } from 'crypto';
import { findOne, create, find, findById, findByIdAndUpdate } from '../models/User';
import { sendToken, signToken } from '../utils/jwt';
import { AppError } from '../middleware/errorHandler';
import { sendWelcomeEmail, sendPasswordResetEmail } from '../services/emailService';
import { notifyNewSeller } from '../services/notificationService';

// ── Register ─────────────────────────────────────────────
export async function register(req, res, next) {
  try {
    const { name, email, password, role } = req.body;

    // Prevent self-assigning admin
    const safeRole = role === 'admin' ? 'customer' : (role || 'customer');

    const existing = await findOne({ email });
    if (existing) return next(new AppError('Email already registered.', 409));

    const user = await create({ name, email, password, role: safeRole });

    await sendWelcomeEmail(user).catch(() => null);
    sendToken(user, 201, res);
  } catch (err) { next(err); }
}

// ── Register as Seller ───────────────────────────────────
export async function registerSeller(req, res, next) {
  try {
    const { name, email, password, storeName, storeBio } = req.body;

    if (!storeName) return next(new AppError('Store name is required.', 400));

    const existing = await findOne({ email });
    if (existing) return next(new AppError('Email already registered.', 409));

    const user = await create({
      name, email, password,
      role: 'seller',
      storeName,
      storeBio,
      sellerStatus: 'pending',
    });

    // Notify admins
    const admins = await find({ role: 'admin' }).select('_id');
    await Promise.all(admins.map(a => notifyNewSeller(a._id, user)));

    sendToken(user, 201, res);
  } catch (err) { next(err); }
}

// ── Login ────────────────────────────────────────────────
export async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    if (!email || !password) return next(new AppError('Email and password are required.', 400));

    const user = await findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      return next(new AppError('Invalid email or password.', 401));
    }
    if (!user.isActive) return next(new AppError('Account suspended. Contact support.', 403));

    user.lastLogin = new Date();
    await user.save({ validateBeforeSave: false });

    sendToken(user, 200, res);
  } catch (err) { next(err); }
}

// ── Refresh token ────────────────────────────────────────
export async function refreshToken(req, res, next) {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return next(new AppError('Refresh token required.', 400));

    const jwt = require('jsonwebtoken');
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const user = await findById(decoded.id);
    if (!user || !user.isActive) return next(new AppError('Invalid refresh token.', 401));

    const token = signToken(user._id, user.role);
    res.json({ success: true, token });
  } catch (err) { next(new AppError('Invalid or expired refresh token.', 401)); }
}

// ── Logout ───────────────────────────────────────────────
export function logout(_req, res) {
  res.cookie('token', '', { expires: new Date(0), httpOnly: true });
  res.json({ success: true, message: 'Logged out successfully.' });
}

// ── Get current user ─────────────────────────────────────
export async function getMe(req, res, next) {
  try {
    const user = await findById(req.user._id);
    res.json({ success: true, user });
  } catch (err) { next(err); }
}

// ── Update profile ───────────────────────────────────────
export async function updateProfile(req, res, next) {
  try {
    const allowed = ['name', 'phone', 'profilePic', 'addresses'];
    // Sellers can also update store info
    if (req.user.role === 'seller') {
      allowed.push('storeName', 'storeBio', 'storeLogo', 'storeBanner');
    }

    const updates = {};
    allowed.forEach(f => { if (req.body[f] !== undefined) updates[f] = req.body[f]; });

    if (req.file) updates.profilePic = req.file.path;

    const user = await findByIdAndUpdate(req.user._id, updates, {
      new: true, runValidators: true,
    });
    res.json({ success: true, user });
  } catch (err) { next(err); }
}

// ── Change password ──────────────────────────────────────
export async function changePassword(req, res, next) {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await findById(req.user._id).select('+password');
    if (!(await user.comparePassword(currentPassword))) {
      return next(new AppError('Current password is incorrect.', 401));
    }
    user.password = newPassword;
    await user.save();
    sendToken(user, 200, res);
  } catch (err) { next(err); }
}

// ── Forgot password ──────────────────────────────────────
export async function forgotPassword(req, res, next) {
  try {
    const user = await findOne({ email: req.body.email });
    if (!user) return next(new AppError('No user found with that email.', 404));

    const token = randomBytes(32).toString('hex');
    user.passwordResetToken = createHash('sha256').update(token).digest('hex');
    user.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 min
    await user.save({ validateBeforeSave: false });

    const resetURL = `${process.env.CLIENT_URL}/reset-password/${token}`;
    await sendPasswordResetEmail(user, resetURL);

    res.json({ success: true, message: 'Password reset link sent to email.' });
  } catch (err) { next(err); }
}

// ── Reset password ───────────────────────────────────────
export async function resetPassword(req, res, next) {
  try {
    const hashed = createHash('sha256').update(req.params.token).digest('hex');
    const user = await findOne({
      passwordResetToken: hashed,
      passwordResetExpires: { $gt: Date.now() },
    });

    if (!user) return next(new AppError('Token is invalid or expired.', 400));

    user.password = req.body.password;
    user.passwordResetToken  = undefined;
    user.passwordResetExpires = undefined;
    await user.save();
    sendToken(user, 200, res);
  } catch (err) { next(err); }
}
