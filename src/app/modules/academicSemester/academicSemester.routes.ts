import express from 'express';
import validateRequest from '../../middlewares/validationRequest';
import { AcademicSemesterValidations } from './academicSemester.validation';
import { AcademicSemesterControllers } from './academicSemester.controller';
import auth from '../../middlewares/auth';

const router=express.Router();

router.post(
  "/create-academic-semester",
  auth("superAdmin", "admin"),
  validateRequest(
    AcademicSemesterValidations.createAcademicSemesterValidationSchema
  ),
  AcademicSemesterControllers.createAcademicSemester
);

router.get(
  "/",
  auth("superAdmin", "admin", "faculty", "student"),
  AcademicSemesterControllers.getAllAcademicSemester
);

router.get(
  "/:semesterId",
  auth("superAdmin", "admin", "faculty", "student"),
  AcademicSemesterControllers.getSingleAcademicSemester
);

router.patch(
  "/:semesterId",
  auth("superAdmin", "admin"),
  validateRequest(AcademicSemesterValidations.updateAcademicValidationSchema),
  AcademicSemesterControllers.updateSingleAcademicSemester
);

export const AcademicSemesterRouters = router;

