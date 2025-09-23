import { Router } from 'express';

import { SubeventoController } from '../controllers/SubeventoController';
import { requireAuth, requireRole } from '../middlewares/auth';

const router = Router();

router.get('/', SubeventoController.list);
router.post('/:id/inscrever', requireAuth, SubeventoController.inscrever);
router.delete('/inscricoes/:id', requireAuth, SubeventoController.cancelar);

router.use(requireAuth, requireRole('admin', 'sub-admin'));
router.post('/', SubeventoController.create);
router.put('/:id', SubeventoController.update);
router.delete('/:id', SubeventoController.remove);

export default router;
