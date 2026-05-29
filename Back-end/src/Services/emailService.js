import { createTransport } from 'nodemailer';

const transporter = createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const baseTemplate = (title, content) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <style>
    body { font-family: Arial, sans-serif; background: #f4f4f4; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 30px auto; background: #fff; border-radius: 12px; overflow: hidden; }
    .header { background: #1d4ed8; color: white; padding: 24px 32px; }
    .header h1 { margin: 0; font-size: 22px; }
    .body { padding: 32px; color: #333; line-height: 1.6; }
    .button { display: inline-block; margin-top: 20px; padding: 12px 28px; background: #1d4ed8; color: white; text-decoration: none; border-radius: 8px; font-weight: bold; }
    .footer { padding: 20px 32px; background: #f9fafb; text-align: center; font-size: 12px; color: #888; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header"><h1>🛍 StyleStore — ${title}</h1></div>
    <div class="body">${content}</div>
    <div class="footer">© ${new Date().getFullYear()} StyleStore. All rights reserved.</div>
  </div>
</body>
</html>`;

const sendEmail = async ({ to, subject, html }) => {
  await transporter.sendMail({
    from: `"StyleStore" <${process.env.EMAIL_FROM}>`,
    to,
    subject,
    html,
  });
};

// ── Pre-built email types ──────────────────────────────────

export function sendWelcomeEmail(user)  {   return sendEmail({
    to: user.email,
    subject: 'Welcome to StyleStore!',
    html: baseTemplate('Welcome!', `
      <p>Hi <strong>${user.name}</strong>,</p>
      <p>Thanks for joining StyleStore! We're thrilled to have you.</p>
      <p>Start browsing our latest collections today.</p>
      <a class="button" href="${process.env.CLIENT_URL}/shop">Shop Now</a>
    `),
  });   }

export function sendSellerApprovalEmail(seller)  {   return sendEmail({
    to: seller.email,
    subject: 'Your Seller Account Has Been Approved!',
    html: baseTemplate('Seller Approved 🎉', `
      <p>Hi <strong>${seller.name}</strong>,</p>
      <p>Congratulations! Your seller account for <strong>${seller.storeName}</strong> has been approved.</p>
      <p>You can now log in to your seller dashboard to start listing products.</p>
      <a class="button" href="${process.env.CLIENT_URL}/seller/dashboard">Go to Dashboard</a>
    `),
  });   }

export function sendSellerRejectionEmail(seller, reason = '')  {   return sendEmail({
    to: seller.email,
    subject: 'Seller Application Update',
    html: baseTemplate('Application Update', `
      <p>Hi <strong>${seller.name}</strong>,</p>
      <p>We're sorry, but your seller application for <strong>${seller.storeName}</strong> was not approved at this time.</p>
      ${reason ? `<p><strong>Reason:</strong> ${reason}</p>` : ''}
      <p>You may reapply after addressing the issues. Contact support if you have questions.</p>
    `),
  });   }

export function sendOrderConfirmationEmail(user, order)  {   return sendEmail({
    to: user.email,
    subject: `Order Confirmed — #${order._id}`,
    html: baseTemplate('Order Confirmed', `
      <p>Hi <strong>${user.name}</strong>,</p>
      <p>Your order <strong>#${order._id}</strong> has been placed successfully.</p>
      <p><strong>Total:</strong> $${order.total.toFixed(2)}</p>
      <p><strong>Status:</strong> ${order.status}</p>
      <a class="button" href="${process.env.CLIENT_URL}/orders">View Order</a>
    `),
  });   }

export function sendOrderStatusEmail(user, order)  {   return sendEmail({
    to: user.email,
    subject: `Order #${order._id} — Status Updated to ${order.status}`,
    html: baseTemplate('Order Update', `
      <p>Hi <strong>${user.name}</strong>,</p>
      <p>Your order <strong>#${order._id}</strong> status has been updated.</p>
      <p><strong>New Status:</strong> ${order.status}</p>
      ${order.trackingNumber ? `<p><strong>Tracking:</strong> ${order.trackingNumber}</p>` : ''}
      <a class="button" href="${process.env.CLIENT_URL}/orders">Track Order</a>
    `),
  });   }

export function sendPasswordResetEmail(user, resetURL)  {   return sendEmail({
    to: user.email,
    subject: 'Password Reset Request',
    html: baseTemplate('Reset Password', `
      <p>Hi <strong>${user.name}</strong>,</p>
      <p>You requested a password reset. Click the button below (valid for 10 minutes):</p>
      <a class="button" href="${resetURL}">Reset Password</a>
      <p style="margin-top:16px; color:#888; font-size:13px;">If you did not request this, ignore this email.</p>
    `),
  });   }
