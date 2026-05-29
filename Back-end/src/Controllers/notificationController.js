import { find, countDocuments, updateMany, findOneAndUpdate, deleteMany, findOneAndDelete } from '../models/Notification';
import { AppError } from '../middleware/errorHandler';

export async function getNotifications(req, res, next) {
  try {
    const { page = 1, limit = 20, unreadOnly } = req.query;
    const filter = { recipient: req.user._id };
    if (unreadOnly === 'true') filter.isRead = false;

    const [notifications, total, unreadCount] = await Promise.all([
      find(filter)
        .sort({ createdAt: -1 })
        .skip((Number(page) - 1) * Number(limit))
        .limit(Number(limit)),
      countDocuments(filter),
      countDocuments({ recipient: req.user._id, isRead: false }),
    ]);

    res.json({
      success: true,
      data: notifications,
      unreadCount,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (err) { next(err); }
}

export async function markRead(req, res, next) {
  try {
    const { id } = req.params;

    if (id === 'all') {
      await updateMany({ recipient: req.user._id }, { isRead: true });
      return res.json({ success: true, message: 'All notifications marked as read.' });
    }

    const notification = await findOneAndUpdate(
      { _id: id, recipient: req.user._id },
      { isRead: true },
      { new: true }
    );
    if (!notification) return next(new AppError('Notification not found.', 404));
    res.json({ success: true, data: notification });
  } catch (err) { next(err); }
}

export async function deleteNotification(req, res, next) {
  try {
    const { id } = req.params;

    if (id === 'all') {
      await deleteMany({ recipient: req.user._id });
      return res.json({ success: true, message: 'All notifications deleted.' });
    }

    const notification = await findOneAndDelete({
      _id: id,
      recipient: req.user._id,
    });
    if (!notification) return next(new AppError('Notification not found.', 404));
    res.json({ success: true, message: 'Notification deleted.' });
  } catch (err) { next(err); }
}
