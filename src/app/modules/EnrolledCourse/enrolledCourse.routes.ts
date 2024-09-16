import express from "express";
import validateRequest from "../../middlewares/validationRequest";
import { EnrolledCourseValidations } from "./enrolledCourse.validation";
import { EnrolledCourseControllers } from "./enrolledCourse.controller";
import auth from "../../middlewares/auth";

const router = express.Router();

router.post(
  "/create-enrolled-course",
  auth("student"),
  validateRequest(
    EnrolledCourseValidations.createEnrolledCourseValidationZodSchema
  ),
  EnrolledCourseControllers.createEnrolledCourse
);

router.get(
  "/my-enrolled-course",
  auth("student"),
  EnrolledCourseControllers.getMyEnrolledCourse
);

router.patch(
  "/update-enrolled-course-marks",
  auth("superAdmin", "admin", "faculty"),
  validateRequest(
    EnrolledCourseValidations.updateEnrolledCourseMarksValidationZodSchema
  ),
  EnrolledCourseControllers.updateEnrolledCourse
);

router.get(
  "/",
  auth("superAdmin", "admin", "faculty"),
  EnrolledCourseControllers.getAllEnrolledCourse
);

export const EnrolledCourseRoutes = router;
