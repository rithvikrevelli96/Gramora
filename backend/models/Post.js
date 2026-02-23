import mongoose from 'mongoose';

const PostSchema = new mongoose.Schema(
  {
    prompt: { type: String },
    caption: { type: String },
    content: { type: String },
    author: { type: String },
  },
  { timestamps: true }
);

// ✅ Prevent OverwriteModelError by reusing existing model if already compiled
export default mongoose.models.Post || mongoose.model('Post', PostSchema);