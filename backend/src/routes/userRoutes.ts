import { Router } from 'express';

import { UserController } from '../controllers/UserController';
import { requireAuth, requireRole } from '../middlewares/auth';

const router = Router();

router.use(requireAuth);

router.get('/me', UserController.me);
router.put('/me', UserController.updateMe);
router.get('/me/export', UserController.exportMe);
router.post('/me/consents', UserController.consents);
router.post('/me/delete-request', UserController.deleteRequest);

router.get('/', requireRole('admin', 'sub-admin'), UserController.list);
router.put('/:id/role', requireRole('admin'), UserController.changeRole);
router.put('/:id/approve-docente', requireRole('admin', 'sub-admin'), UserController.approveDocente);
router.delete('/:id', requireRole('admin'), UserController.remove);

export default router;
