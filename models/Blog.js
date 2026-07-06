import mongoose from 'mongoose';

const DEFAULT_AUTHOR = 'Romoire Travel Expert';

const BlogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a title for this blog'],
    trim: true,
  },
  slug: {
    type: String,
    required: [true, 'Please provide a slug for this blog'],
    unique: true,
    trim: true,
    lowercase: true,
  },
  excerpt: {
    type: String,
    required: [true, 'Please provide an excerpt for this blog'],
    maxlength: [200, 'Excerpt cannot be more than 200 characters'],
  },
  content: {
    type: String,
    required: [true, 'Please provide content for this blog'],
  },
  author: {
    type: String,
    required: [true, 'Please provide an author name'],
    default: DEFAULT_AUTHOR,
  },
  category: {
    type: String,
    required: [true, 'Please provide a category'],
    enum: ['Travel Tips', 'Destinations', 'Lifestyle', 'News', 'Experience'],
    default: 'Experience',
  },
  image: {
    public_id: { type: String, required: true },
    url: { type: String, required: true },
    alt: { type: String, default: '' }
  },
  isFeatured: {
    type: Boolean,
    default: false,
  },
  status: {
    type: String,
    enum: ['draft', 'published'],
    default: 'published',
  },
  tags: [String],
}, { 
  timestamps: true 
});

export default mongoose.models.Blog || mongoose.model('Blog', BlogSchema);
