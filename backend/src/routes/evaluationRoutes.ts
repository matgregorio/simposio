import { Router } from 'express';

import { EvaluationController } from '../controllers/EvaluationController';
import { requireAuth, requireRole } from '../middlewares/auth';

const router = Router();

router.use(requireAuth);
router.post('/', requireRole('avaliador-externo', 'admin', 'sub-admin'), EvaluationController.upsert);
router.get('/by-submission/:id', requireRole('admin', 'sub-admin', 'avaliador-externo'), EvaluationController.listBySubmission);

export default router;
