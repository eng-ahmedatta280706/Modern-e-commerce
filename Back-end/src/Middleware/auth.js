import { verify } from 'jsonwebtoken';
import { findById } from '../models/User';

/**
 * Verifies JWT from Authorization header or cookie.
 * Attaches req.user on success.
 */
const protect = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization?.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies?.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return res.status(401).json({ success: false, message: 'Not authenticated. Please log in.' });
    }

    const decoded = verify(token, process.env.JWT_SECRET);

    const user = await findById(decoded.id).select('-password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'User no longer exists.' });
    }
    if (!user.isActive) {
      return res.status(403).json({ success: false, message: 'Your account has been suspended.' });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Invalid or expired token.' });
  }
};

/**
 * Role-based access control.
 * Usage: authorize('admin') or authorize('admin', 'seller')
 */
const authorize = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({
      success: false,
      message: `Access denied. Requires one of: ${roles.join(', ')}.`,
    });
  }
  next();
};

/**
 * Seller-specific: ensure seller account is approved.
 */
const requireApprovedSeller = (req, res, next) => {
  if (req.user.role === 'seller' && req.user.sellerStatus !== 'approved') {
    return res.status(403).json({
      success: false,
      message: `Your seller account is ${req.user.sellerStatus}. Please wait for admin approval.`,
    });
  }
  next();
};

export default { protect, authorize, requireApprovedSeller };
