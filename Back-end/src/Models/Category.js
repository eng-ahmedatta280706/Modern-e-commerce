import { Schema, model } from 'mongoose';
import slugify from 'slugify';

const categorySchema = new Schema({
  name:        { type: String, required: true, unique: true, trim: true },
  slug:        { type: String, unique: true },
  description: { type: String, default: '' },
  image:       { type: String, default: '' },
  parent:      { type: Schema.Types.ObjectId, ref: 'Category', default: null },
  isActive:    { type: Boolean, default: true },
  order:       { type: Number, default: 0 },
}, { timestamps: true });

categorySchema.pre('save', function (next) {
  if (this.isModified('name')) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
  next();
});

export default model('Category', categorySchema);
