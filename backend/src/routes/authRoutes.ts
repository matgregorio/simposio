import { Router } from 'express';

import { AuthController } from '../controllers/AuthController';
import { requireAuth } from '../middlewares/auth';

const router = Router();

router.post('/register', AuthController.register);
router.post('/login', AuthController.login);
router.post('/refresh', AuthController.refresh);
router.post('/logout', AuthController.logout);
router.post('/2fa/enable', requireAuth, AuthController.enable2FA);
router.post('/2fa/verify', requireAuth, AuthController.verify2FA);

export default router;
