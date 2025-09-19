import { Router } from 'express';

import { DatesController } from '../controllers/DatesController';
import { requireAuth, requireRole } from '../middlewares/auth';

const router = Router();

router.get('/', DatesController.list);

router.use(requireAuth, requireRole('admin', 'sub-admin'));
router.post('/', DatesController.create);
router.put('/:id', DatesController.update);
router.delete('/:id', DatesController.delete);

export default router;
