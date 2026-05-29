import { Schema, model } from 'mongoose';
import { hash, compare } from 'bcryptjs';

const addressSchema = new Schema({
  label:    { type: String, default: 'Home' },
  street:   String,
  city:     String,
  state:    String,
  country:  String,
  zipCode:  String,
  isDefault:{ type: Boolean, default: false },
}, { _id: true });

const userSchema = new Schema({
  name:        { type: String, required: true, trim: true },
  email:       { type: String, required: true, unique: true, lowercase: true, trim: true },
  password:    { type: String, required: true, minlength: 8, select: false },
  phone:       { type: String, default: '' },
  profilePic:  { type: String, default: '' },
  role: {
    type: String,
    enum: ['customer', 'seller', 'admin'],
    default: 'customer',
  },

  // ── Seller extras ────────────────────────────
  storeName:   { type: String, default: '' },
  storeSlug:   { type: String, default: '', unique: true, sparse: true },
  storeBio:    { type: String, default: '' },
  storeLogo:   { type: String, default: '' },
  storeBanner: { type: String, default: '' },
  sellerStatus:{
    type: String,
    enum: ['pending', 'approved', 'rejected', 'suspended'],
    default: 'pending',
  },
  commissionRate: { type: Number, default: 10 }, // %

  // ── Customer extras ──────────────────────────
  addresses:   [addressSchema],
  wishlist:    [{ type: Schema.Types.ObjectId, ref: 'Product' }],

  // ── Auth / security ──────────────────────────
  isVerified:          { type: Boolean, default: false },
  isActive:            { type: Boolean, default: true },
  passwordResetToken:  String,
  passwordResetExpires:Date,
  refreshToken:        String,
  lastLogin:           Date,
}, { timestamps: true });

// Hash password before save
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await hash(this.password, 12);
  next();
});

// Compare password
userSchema.methods.comparePassword = async function (candidate) {
  return compare(candidate, this.password);
};

// Don't return password
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  delete obj.refreshToken;
  delete obj.passwordResetToken;
  delete obj.passwordResetExpires;
  return obj;
};

export default model('User', userSchema);
