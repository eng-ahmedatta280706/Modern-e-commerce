import pkg from 'jsonwebtoken';
const { sign } = pkg;

export const signToken = (id, role) =>
  sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });

export const signRefreshToken = (id) =>
  sign({ id }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d',
  });

/**
 * Creates token, attaches cookie, and sends JSON response.
 */
export const sendToken = (user, statusCode, res) => {
  const token        = signToken(user.id, user.role);
  const refreshToken = signRefreshToken(user.id);

  const cookieOptions = {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  };

  res.cookie('token', token, cookieOptions);

  res.status(statusCode).json({
    success: true,
    token,
    refreshToken,
    user,
  });
};

export default { signToken, signRefreshToken, sendToken };
