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

const Post = mongoose.model('Post', PostSchema);
export default Post;



