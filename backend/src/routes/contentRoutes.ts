import { Router } from 'express';

import { ContentController } from '../controllers/ContentController';
import { requireAuth, requireRole } from '../middlewares/auth';

const router = Router();

router.get('/:slug', ContentController.get);

router.use(requireAuth, requireRole('admin', 'sub-admin'));
router.put('/:slug', ContentController.upsert);
router.delete('/:slug', ContentController.remove);

export default router;
