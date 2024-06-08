import express from 'express';
import { AdminControllers } from './admin.controller';
import { adminValidations } from './admin.validation';
import validateRequest from '../../middlewares/validationRequest';

const router = express.Router();

router.get('/', AdminControllers.getAllAdmin);

router.get('/:adminId', AdminControllers.getSingleAdmin);

router.patch(
  '/:adminId',
  validateRequest(adminValidations.updateAdminValidationSchema),
  AdminControllers.updatedAdmin,
);

router.delete('/:adminId', AdminControllers.deleteSingleAdmin);

export const AdminRouters = router;
