import { Router } from 'express';

import { AcervoController } from '../controllers/AcervoController';
import { requireAuth, requireRole } from '../middlewares/auth';

const router = Router();

router.get('/', AcervoController.list);
router.get('/:id/download', AcervoController.download);

router.post('/', requireAuth, requireRole('admin', 'sub-admin'), AcervoController.upload);

export default router;
