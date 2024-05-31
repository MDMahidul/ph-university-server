import express from 'express';
import validateRequest from '../../middlewares/validationRequest';
import { AcademicSemesterValidations } from './academicSemester.validation';
import { AcademicSemesterControllers } from './academicSemester.controller';

const router=express.Router();

router.post('/create-academic-semester',validateRequest(AcademicSemesterValidations.createAcademicSemesterValidationSchema),AcademicSemesterControllers.createAcademicSemester)

router.get('/',AcademicSemesterControllers.getAllAcademicSemester);

router.get('/:semesterId',AcademicSemesterControllers.getSingleAcademicSemester);

router.patch('/:semesterId',validateRequest(AcademicSemesterValidations.updateAcademicValidationSchema),AcademicSemesterControllers.updateSingleAcademicSemester);

export const AcademicSemesterRouters = router;

