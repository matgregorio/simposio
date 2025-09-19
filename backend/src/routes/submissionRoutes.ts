import { Router } from 'express';

import { SubmissionController } from '../controllers/SubmissionController';
import { requireAuth, requireRole } from '../middlewares/auth';

const router = Router();

router.use(requireAuth);

router.get('/', requireRole('admin', 'sub-admin', 'avaliador-externo'), SubmissionController.list);
router.post('/', SubmissionController.create);
router.get('/:id', SubmissionController.getById);
router.post('/:id/assign', requireRole('admin', 'sub-admin'), SubmissionController.assign);
router.post('/:id/status', requireRole('admin', 'sub-admin'), SubmissionController.updateStatus);
router.delete('/:id', requireRole('admin', 'sub-admin'), SubmissionController.remove);

export default router;
