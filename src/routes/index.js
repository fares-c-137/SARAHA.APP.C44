import { Router } from 'express';
import accountRoutes from './account.routes.js';
import postRoutes from './post.routes.js';

const router = Router({ caseSensitive: true, strict: false, mergeParams: true });

router.use('/users', accountRoutes);
router.use('/messages', postRoutes);

export default router;
