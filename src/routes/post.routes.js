import { Router } from 'express';
import validation from '../middlewares/validation.js';
import fileUpload from '../middlewares/fileUpload.js';
import Joi from 'joi';
import * as ctrl from '../controllers/post.controller.js';

const router = Router({ caseSensitive: true, strict: false, mergeParams: true });

const sendPostSchema = Joi.object({
  text: Joi.string().min(1).max(500).required(),
  anonymousName: Joi.string().min(1).max(50).optional()
});

const listQuerySchema = Joi.object({
  limit: Joi.number().integer().min(1).max(100).default(10),
  page: Joi.number().integer().min(1).default(1)
});

router.post('/:username', fileUpload.single('image'), validation(sendPostSchema), ctrl.sendPost);
router.get('/:username', validation(listQuerySchema, 'query'), ctrl.getPosts);
router.delete('/:username/:messageId', ctrl.removePost);

export default router;