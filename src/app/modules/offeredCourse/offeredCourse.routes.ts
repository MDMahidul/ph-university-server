import express from 'express';
import { OfferedCourseValidations } from './offeredCourse.validation';
import { OfferedCourseControllers } from './offeredCourse.controller';
import validateRequest from '../../middlewares/validationRequest';

const router = express.Router();

router.post(
  '/create-offered-course',
  validateRequest(OfferedCourseValidations.createOfferedCourseValidationSchema),
  OfferedCourseControllers.createOfferedCourse,
);

router.patch(
  "/:id",
  validateRequest(OfferedCourseValidations.updateOfferedCourseValidationSchema),
  OfferedCourseControllers.updateOfferedCourse
);

export const OfferedCourseRoutes = router;