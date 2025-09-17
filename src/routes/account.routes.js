import { Router } from 'express';
import validation from '../middlewares/validation.js';
import Joi from 'joi';
import * as ctrl from '../controllers/account.controller.js';

const router = Router({ caseSensitive: true, strict: false, mergeParams: true });

const registerAccountSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).required(),
  email: Joi.string().email().optional()
});

router.post('/', validation(registerAccountSchema), ctrl.registerAccount);
router.get('/:username', ctrl.fetchProfile);

export default router;