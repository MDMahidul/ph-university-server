import express from 'express';
import { OfferedCourseValidations } from './offeredCourse.validation';
import { OfferedCourseControllers } from './offeredCourse.controller';
import validateRequest from '../../middlewares/validationRequest';
import auth from '../../middlewares/auth';

const router = express.Router();

router.get("/",auth('superAdmin','admin','faculty'), OfferedCourseControllers.getAllOfferedCourses);

router.get("/my-offered-courses",auth('student'), OfferedCourseControllers.getMyOfferedCourses);

router.get(
  "/:id",
  auth("superAdmin", "admin", "faculty",'student'),
  OfferedCourseControllers.getSingleOfferedCourses
);

router.post(
  "/create-offered-course",
  auth("superAdmin", "admin"),
  validateRequest(OfferedCourseValidations.createOfferedCourseValidationSchema),
  OfferedCourseControllers.createOfferedCourse
);

router.patch(
  "/:id",
  auth("superAdmin", "admin"),
  validateRequest(OfferedCourseValidations.updateOfferedCourseValidationSchema),
  OfferedCourseControllers.updateOfferedCourse
);

router.delete(
  "/:id",
  auth("superAdmin", "admin"),
  OfferedCourseControllers.deleteOfferedCourse
);

export const OfferedCourseRoutes = router;