import { Schema, model } from 'mongoose';
import slugify from 'slugify';

const reviewSchema = new Schema({
  user:    { type: Schema.Types.ObjectId, ref: 'User', required: true },
  name:    { type: String, required: true },
  rating:  { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
}, { timestamps: true });

const colorImageSchema = new Schema({
  color: { type: String, required: true },
  image: { type: String, required: true },
}, { _id: false });

const productSchema = new Schema({
  seller:      { type: Schema.Types.ObjectId, ref: 'User', required: true },
  name:        { type: String, required: true, trim: true },
  slug:        { type: String, unique: true },
  description: { type: String, required: true },
  price:       { type: Number, required: true, min: 0 },
  discount:    { type: Number, default: 0, min: 0, max: 100 }, // %
  salePrice:   { type: Number, default: 0 },

  category:    { type: String, required: true },
  subcategory: { type: String, default: '' },
  tags:        [String],

  images:      [String],          // array of URLs
  colorImages: [colorImageSchema],
  colors:      [String],
  sizes:       [String],
  video:       { type: String, default: '' },

  badge: {
    type: String,
    enum: ['New', 'Sale', 'Best Seller', ''],
    default: '',
  },

  stock:       { type: Number, required: true, default: 0, min: 0 },
  sold:        { type: Number, default: 0 },

  reviews:     [reviewSchema],
  numReviews:  { type: Number, default: 0 },
  rating:      { type: Number, default: 0 },

  isActive:    { type: Boolean, default: true },
  isFeatured:  { type: Boolean, default: false },

  dimensions: {
    length: Number,
    width:  Number,
    height: Number,
    weight: Number,
  },
  meta: { type: Map, of: String },
}, { timestamps: true });

// Auto-generate slug
productSchema.pre('save', function (next) {
  if (this.isModified('name')) {
    this.slug = slugify(this.name, { lower: true, strict: true }) + '-' + Date.now();
  }
  // Compute salePrice
  if (this.discount > 0) {
    this.salePrice = +(this.price * (1 - this.discount / 100)).toFixed(2);
  } else {
    this.salePrice = this.price;
  }
  next();
});

// Recalculate average rating after review changes
productSchema.methods.updateRating = function () {
  if (this.reviews.length === 0) {
    this.rating = 0;
    this.numReviews = 0;
  } else {
    const total = this.reviews.reduce((sum, r) => sum + r.rating, 0);
    this.rating = +(total / this.reviews.length).toFixed(1);
    this.numReviews = this.reviews.length;
  }
};

// Indexes
productSchema.index({ name: 'text', description: 'text', tags: 'text' });
productSchema.index({ category: 1, subcategory: 1 });
productSchema.index({ seller: 1 });
productSchema.index({ price: 1 });
productSchema.index({ rating: -1 });

export default model('Product', productSchema);
