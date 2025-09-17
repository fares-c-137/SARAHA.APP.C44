import { Schema, model, Types } from 'mongoose';

const postSchema = new Schema({
  user: { type: Types.ObjectId, ref: 'Account', required: true, index: true },
  text: { type: String, required: true, maxlength: 500 },
  anonymousName: { type: String },
  imageUrl: { type: String },
  imagePublicId: { type: String },
  ip: { type: String }
}, { timestamps: true });

const Post = model('Post', postSchema);
export default Post;