import { Router } from 'express';

import acervoRoutes from './acervoRoutes';
import authRoutes from './authRoutes';
import catalogRoutes from './catalogRoutes';
import certificateRoutes from './certificateRoutes';
import contentRoutes from './contentRoutes';
import datesRoutes from './datesRoutes';
import evaluationRoutes from './evaluationRoutes';
import subeventoRoutes from './subeventoRoutes';
import submissionRoutes from './submissionRoutes';
import userRoutes from './userRoutes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/catalog', catalogRoutes);
router.use('/dates', datesRoutes);
router.use('/content', contentRoutes);
router.use('/acervo', acervoRoutes);
router.use('/subeventos', subeventoRoutes);
router.use('/submissions', submissionRoutes);
router.use('/evaluations', evaluationRoutes);
router.use('/certificates', certificateRoutes);

export default router;
