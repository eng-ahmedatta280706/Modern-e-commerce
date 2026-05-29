import { Schema, model } from 'mongoose';

const orderItemSchema = new Schema({
  product:       { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  seller:        { type: Schema.Types.ObjectId, ref: 'User', required: true },
  name:          { type: String, required: true },
  image:         String,
  price:         { type: Number, required: true },
  quantity:      { type: Number, required: true, min: 1 },
  selectedColor: String,
  selectedSize:  String,
}, { _id: true });

const addressSchema = new Schema({
  name:    String,
  email:   String,
  phone:   String,
  street:  String,
  city:    String,
  state:   String,
  country: String,
  zipCode: String,
}, { _id: false });

const orderSchema = new Schema({
  customer: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  items:    [orderItemSchema],

  shippingAddress: addressSchema,
  shippingMethod: {
    type: String,
    enum: ['standard', 'express', 'pickup'],
    default: 'standard',
  },
  shippingCost: { type: Number, default: 5 },

  paymentMethod: {
    type: String,
    enum: ['card', 'paypal', 'cod', 'stripe'],
    required: true,
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending',
  },
  stripePaymentIntentId: String,

  subtotal: { type: Number, required: true },
  tax:      { type: Number, default: 0 },
  discount: { type: Number, default: 0 },
  total:    { type: Number, required: true },

  couponCode: String,

  status: {
    type: String,
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'],
    default: 'pending',
  },

  trackingNumber: String,
  notes:          String,
  deliveredAt:    Date,
  cancelledAt:    Date,
}, { timestamps: true });

// Indexes
orderSchema.index({ customer: 1, createdAt: -1 });
orderSchema.index({ status: 1 });
orderSchema.index({ 'items.seller': 1 });

export default model('Order', orderSchema);
