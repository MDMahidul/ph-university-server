import express from 'express';
import validateRequest from '../../middlewares/validationRequest';
import { AcademicSemesterValidations } from './academicSemester.validation';
import { AcademicSemesterControllers } from './academicSemester.controller';

const router=express.Router();

router.post('/create-academic-semester',validateRequest(AcademicSemesterValidations.createAcademicSemesterSchemaValidation),AcademicSemesterControllers.createAcademicSemester)

export const AcademicSemesterRouters = router;

