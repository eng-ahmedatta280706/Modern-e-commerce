import {
  getUserNotifications,
  getUnreadCount,
  markAllAsRead,
  markNotificationAsRead,
  findNotificationById,
  deleteNotification as deleteNotificationModel,
  deleteUserNotifications,
} from '../Models/Notification.js';
import errorHandler from '../Middleware/errorHandler.js';

const { AppError } = errorHandler;

export async function getNotifications(req, res, next) {
  try {
    const { page = 1, limit = 20, unreadOnly } = req.query;
    const pageNum = Number(page);
    const lim = Number(limit);

    // fetch recent notifications (drizzle helper returns ordered results)
    const all = await getUserNotifications(req.user.id, pageNum * lim);
    const paged = all.slice((pageNum - 1) * lim, pageNum * lim);
    const total = all.length;
    const unreadCount = await getUnreadCount(req.user.id);

    res.json({
      success: true,
      data: paged,
      unreadCount,
      pagination: {
        page: pageNum,
        limit: lim,
        total,
        pages: Math.max(1, Math.ceil(total / lim)),
      },
    });
  } catch (err) { next(err); }
}

export async function markRead(req, res, next) {
  try {
    const { id } = req.params;

    if (id === 'all') {
      await markAllAsRead(req.user.id);
      return res.json({ success: true, message: 'All notifications marked as read.' });
    }

    const notification = await findNotificationById(id);
    if (!notification || String(notification.recipientId) !== String(req.user.id)) {
      return next(new AppError('Notification not found.', 404));
    }

    const updated = await markNotificationAsRead(id);
    res.json({ success: true, data: updated });
  } catch (err) { next(err); }
}

export async function deleteNotification(req, res, next) {
  try {
    const { id } = req.params;

    if (id === 'all') {
      await deleteUserNotifications(req.user.id);
      return res.json({ success: true, message: 'All notifications deleted.' });
    }

    const notification = await findNotificationById(id);
    if (!notification || String(notification.recipientId) !== String(req.user.id)) {
      return next(new AppError('Notification not found.', 404));
    }

    await deleteNotificationModel(id);
    res.json({ success: true, message: 'Notification deleted.' });
  } catch (err) { next(err); }
}
