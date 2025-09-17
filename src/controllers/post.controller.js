import cloudStorage from '../config/cloudStorage.js';
import Account from '../models/Account.js';
import Post from '../models/Post.js';
import ResponseHelper from '../utils/ResponseHelper.js';
import asyncWrapper from '../utils/asyncWrapper.js';
import streamifier from 'streamifier';

const uploadImageFromBuffer = (buffer) => new Promise((resolve, reject) => {
  const stream = cloudStorage.uploader.upload_stream(
    { folder: 'anonymous/posts', resource_type: 'image' },
    (error, result) => {
      if (error) return reject(error);
      return resolve(result);
    }
  );
  streamifier.createReadStream(buffer).pipe(stream);
});

export const sendPost = asyncWrapper(async (req, res) => {
  const { username } = req.params;
  const account = await Account.findOne({ username: username.toLowerCase() });
  if (!account) return res.status(404).json(ResponseHelper.error('Account not found'));

  let imageUrl = null, imagePublicId = null;
  if (req.file) {
    try {
      const uploaded = await uploadImageFromBuffer(req.file.buffer);
      imageUrl = uploaded.secure_url;
      imagePublicId = uploaded.public_id;
    } catch {
      return res.status(400).json(ResponseHelper.error('Image upload failed'));
    }
  }

  const post = await Post.create({
    user: account._id,
    text: req.body.text,
    anonymousName: req.body.anonymousName || null,
    imageUrl,
    imagePublicId,
    ip: req.ip
  });

  return res.status(201).json(ResponseHelper.success('Post created', {
    id: post._id,
    text: post.text,
    anonymousName: post.anonymousName,
    imageUrl: post.imageUrl,
    createdAt: post.createdAt
  }));
});

export const getPosts = asyncWrapper(async (req, res) => {
  const { username } = req.params;
  const { limit, page } = req.query;
  const account = await Account.findOne({ username: username.toLowerCase() });
  if (!account) return res.status(404).json(ResponseHelper.error('Account not found'));

  const skip = (page - 1) * limit;
  const [items, total] = await Promise.all([
    Post.find({ user: account._id }).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Post.countDocuments({ user: account._id })
  ]);

  return res.json(ResponseHelper.success('Posts list', {
    items: items.map(i => ({
      id: i._id,
      text: i.text,
      anonymousName: i.anonymousName,
      imageUrl: i.imageUrl,
      createdAt: i.createdAt
    })),
    meta: { total, page, limit, pages: Math.ceil(total / limit) }
  }));
});

export const removePost = asyncWrapper(async (req, res) => {
  const { username, messageId } = req.params;
  const account = await Account.findOne({ username: username.toLowerCase() });
  if (!account) return res.status(404).json(ResponseHelper.error('Account not found'));

  const token = req.headers['x-manage-token'];
  const isAdmin = process.env.ADMIN_KEY && req.headers['x-admin-key'] === process.env.ADMIN_KEY;
  if (account.manageToken !== token && !isAdmin) {
    return res.status(403).json(ResponseHelper.error('Forbidden: invalid manage token'));
  }

  const post = await Post.findOne({ _id: messageId, user: account._id });
  if (!post) return res.status(404).json(ResponseHelper.error('Post not found'));

  if (post.imagePublicId) {
    try { await cloudStorage.uploader.destroy(post.imagePublicId); } catch {}
  }

  await post.deleteOne();
  return res.json(ResponseHelper.success('Post deleted'));
});