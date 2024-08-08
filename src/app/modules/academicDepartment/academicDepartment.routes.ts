import express from 'express';
import validateRequest from '../../middlewares/validationRequest';
import { AcademicDepartmentValidation } from './academicDepartment.validation';
import { AcademicDepartmentControllers } from './academicDepartment.controller';
import auth from '../../middlewares/auth';

const router = express.Router();

router.post(
  "/create-academic-department",
  auth("superAdmin", "admin"),
  validateRequest(
    AcademicDepartmentValidation.createAcademicDepartmentValidationSchema
  ),
  AcademicDepartmentControllers.createAcademicDepartment
);

router.get(
  "/",
  auth("superAdmin", "admin", "faculty", "student"),
  AcademicDepartmentControllers.getAllAcademicDepartments
);

router.get(
  "/:departmentId",
  auth("superAdmin", "admin", "faculty", "student"),
  AcademicDepartmentControllers.getSingleAcademicDepartment
);

router.patch(
  "/:departmentId",
  auth("superAdmin", "admin"),
  validateRequest(
    AcademicDepartmentValidation.updateAcademicDepartmentValidationSchema
  ),
  AcademicDepartmentControllers.updateSingleAcademicDepartment
);

export const AcademicDepartmentRouters = router;
