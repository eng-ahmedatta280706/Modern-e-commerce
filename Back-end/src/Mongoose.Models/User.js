// import { Schema, model } from 'mongoose';
// import { hash, compare } from 'bcryptjs';
// const addressSchema = new Schema({
//   label:    { type: String, default: 'Home' },
//   street:   String,
//   city:     String,
//   state:    String,
//   country:  String,
//   zipCode:  String,
//   isDefault:{ type: Boolean, default: false },
// }, { _id: true });
// const userSchema = new Schema({
//   name:        { type: String, required: true, trim: true },
//   email:       { type: String, required: true, unique: true, lowercase: true, trim: true },
//   password:    { type: String, required: true, minlength: 8, select: false },
//   phone:       { type: String, default: '' },
//   profilePic:  { type: String, default: '' },
//   role: {
//     type: String,
//     enum: ['customer', 'seller', 'admin'],
//     default: 'customer',
//   },

//   // ── Seller extras ────────────────────────────
//   storeName:   { type: String, default: '' },
//   storeSlug:   { type: String, default: '', unique: true, sparse: true },
//   storeBio:    { type: String, default: '' },
//   storeLogo:   { type: String, default: '' },
//   storeBanner: { type: String, default: '' },
//   sellerStatus:{
//     type: String,
//     enum: ['pending', 'approved', 'rejected', 'suspended'],
//     default: 'pending',
//   },
//   commissionRate: { type: Number, default: 10 }, // %

//   // ── Customer extras ──────────────────────────
//   addresses:   [addressSchema],
//   wishlist:    [{ type: Schema.Types.ObjectId, ref: 'Product' }],

//   // ── Auth / security ──────────────────────────
//   isVerified:          { type: Boolean, default: false },
//   isActive:            { type: Boolean, default: true },
//   passwordResetToken:  String,
//   passwordResetExpires:Date,
//   refreshToken:        String,
//   lastLogin:           Date,
// }, { timestamps: true });
// // Hash password before save
// userSchema.pre('save', async function (next) {
//   if (!this.isModified('password')) return next();
//   this.password = await hash(this.password, 12);
//   next();
// });
// // Compare password
// userSchema.methods.comparePassword = async function (candidate) {
//   return compare(candidate, this.password);
// };
// // Don't return password
// userSchema.methods.toJSON = function () {
//   const obj = this.toObject();
//   delete obj.password;
//   delete obj.refreshToken;
//   delete obj.passwordResetToken;
//   delete obj.passwordResetExpires;
//   return obj;
// };
// userSchema.methods.isAdmin = function () {
//   return this.role === 'admin';
// };
// userSchema.methods.isSeller = function () {
//   return this.role === 'seller';
// };
// userSchema.methods.isApprovedSeller = function () {
//   return this.role === 'seller' &&
//     this.sellerStatus === 'approved';
// };
// userSchema.index({ email: 1 });
// userSchema.index({ role: 1 });
// userSchema.index({ sellerStatus: 1 });
// export const findOne = async (query) => await model('User', userSchema).findOne(query);
// export const find = async (query) => await model('User', userSchema).find(query);
// export const findById = async (id) => await model('User', userSchema).findById(id);
// export const create = async (data) => await model('User', userSchema).create(data);
// export const findByIdAndUpdate = async (id, update, options) => await model('User', userSchema).findByIdAndUpdate(id, update, options);
// export const countDocuments = async (query) => await model('User', userSchema).countDocuments(query);
// export default model('User', userSchema);

import { Schema, model } from 'mongoose';
import { hash, compare } from 'bcryptjs';

const addressSchema = new Schema({
  label: {
    type: String,
    default: 'Home'
  },
  street: String,
  city: String,
  state: String,
  country: String,
  zipCode: String,
  isDefault: {
    type: Boolean,
    default: false
  }
}, { _id: true });

const userSchema = new Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, minlength: 8, select: false },
  phone: { type: String, default: '' },
  profilePic: { type: String, default: '' },
  role: { type: String, enum: ['customer', 'seller', 'admin'], default: 'customer' },

  // Seller Fields
  storeName: {type: String, default: '' },
  storeSlug: {type: String, default: '', unique: true, sparse: true },
  storeBio: { type: String, default: '' },
  storeLogo: { type: String, default: '' },
  storeBanner: { type: String, default: '' },
  sellerStatus: { type: String, enum: ['pending','approved','rejected','suspended'], default: 'pending' },
  commissionRate: { type: Number, default: 10 },

  // Customer Fields
  addresses: [addressSchema],
  wishlist: [{ type: Schema.Types.ObjectId, ref: 'Product' }],

  // Security
  isVerified: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  passwordResetToken: String,
  passwordResetExpires: Date,
  refreshToken: String,
  lastLogin: Date
}, {
  timestamps: true
});

// Hash Password
userSchema.pre('save', async function (next) {
  if (!this.isModified('password'))
    return next();
  this.password = await hash(
    this.password,
    12
  );
  next();
});

// Compare Password
userSchema.methods.comparePassword = async function (candidatePassword) {
  return compare(
    candidatePassword,
    this.password
  );
};

// Helpers
userSchema.methods.isAdmin = function () {
    return this.role === 'admin';
};

userSchema.methods.isSeller = function () {
    return this.role === 'seller';
};

userSchema.methods.isApprovedSeller = function () {
    return (
      this.role === 'seller' &&
      this.sellerStatus === 'approved'
    );
};

// Hide Sensitive Data
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  delete obj.refreshToken;
  delete obj.passwordResetToken;
  delete obj.passwordResetExpires;
  return obj;
};

userSchema.statics.findOne = async function (query) {
  return await this.findOne(query);
};

userSchema.statics.find = async function (query) {
  return await this.find(query);
};

userSchema.statics.findById = async function (id) {
  return await this.findById(id);
};

userSchema.statics.create = async function (data) {
  return await this.create(data);
};

userSchema.statics.findByIdAndUpdate = async function (id, update, options) {
  return await this.findByIdAndUpdate(id, update, options);
};

userSchema.statics.countDocuments = async function (query) {
  return await this.countDocuments(query);
};

// Indexes
userSchema.index({ email: 1 });
userSchema.index({ role: 1 });
userSchema.index({ sellerStatus: 1 });

const User = model('User', userSchema);

export default User;
