import { Schema, model } from 'mongoose';

const notificationSchema = new Schema({
  recipient: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  type: {
    type: String,
    enum: [
      'new_order', 'order_status', 'new_seller', 'seller_approved',
      'seller_rejected', 'low_stock', 'new_review', 'payment_received',
      'refund_request', 'system',
    ],
    required: true,
  },
  title: { type: String, required: true },
  message: { type: String, required: true },
  link: { type: String, default: '' },
  isRead: { type: Boolean, default: false },
  data: { type: Schema.Types.Mixed, default: {} },
}, { timestamps: true });

notificationSchema.methods.markAsRead = function () {
  this.isRead = true;
  return this;
};

notificationSchema.statics.markAllRead = function (userId) {
  return this.updateMany(
    {
      recipient: userId,
      isRead: false
    },
    {
      isRead: true
    }
  );
};

notificationSchema.index({ recipient: 1, isRead: 1, createdAt: -1 });

export function create(recipient, type, title, message, link, data) {
  const notification = new this({ recipient, type, title, message, link, data });
  return notification.save();
}

export default model('Notification', notificationSchema);
