import { Router } from 'express';

import { CatalogController } from '../controllers/CatalogController';
import { requireAuth, requireRole } from '../middlewares/auth';

const router = Router();

router.get('/areas', CatalogController.listAreas);
router.get('/grandes-areas', CatalogController.listGrandesAreas);
router.get('/subareas', CatalogController.listSubareas);

router.use(requireAuth, requireRole('admin', 'sub-admin'));

router.post('/areas', CatalogController.createArea);
router.put('/areas/:id', CatalogController.updateArea);
router.delete('/areas/:id', CatalogController.deleteArea);

router.post('/grandes-areas', CatalogController.createGrandeArea);
router.put('/grandes-areas/:id', CatalogController.updateGrandeArea);
router.delete('/grandes-areas/:id', CatalogController.deleteGrandeArea);

router.post('/subareas', CatalogController.createSubarea);
router.put('/subareas/:id', CatalogController.updateSubarea);
router.delete('/subareas/:id', CatalogController.deleteSubarea);

export default router;
