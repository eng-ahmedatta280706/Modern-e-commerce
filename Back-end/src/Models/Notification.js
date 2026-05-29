import { Schema, model } from 'mongoose';

const notificationSchema = new Schema({
  recipient:  { type: Schema.Types.ObjectId, ref: 'User', required: true },
  type: {
    type: String,
    enum: [
      'new_order', 'order_status', 'new_seller', 'seller_approved',
      'seller_rejected', 'low_stock', 'new_review', 'payment_received',
      'refund_request', 'system',
    ],
    required: true,
  },
  title:   { type: String, required: true },
  message: { type: String, required: true },
  link:    { type: String, default: '' },
  isRead:  { type: Boolean, default: false },
  data:    { type: Schema.Types.Mixed, default: {} },
}, { timestamps: true });

notificationSchema.index({ recipient: 1, isRead: 1, createdAt: -1 });

export default model('Notification', notificationSchema);
