import { Router } from 'express';

import { CertificateController } from '../controllers/CertificateController';
import { requireAuth, requireRole } from '../middlewares/auth';

const router = Router();

router.get('/settings', CertificateController.getSettings);
router.get('/validate/:code', CertificateController.validate);

router.use(requireAuth);
router.get('/my', CertificateController.listMy);
router.post('/emit', requireRole('admin', 'sub-admin'), CertificateController.emit);
router.put('/settings', requireRole('admin', 'sub-admin'), CertificateController.upsertSettings);

export default router;
