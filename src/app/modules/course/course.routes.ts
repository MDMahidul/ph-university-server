import express from "express";
import { CourseControllers } from "./course.controller";
import { CourseValidations } from "./course.validation";
import validateRequest from "../../middlewares/validationRequest";
import auth from "../../middlewares/auth";

const router = express.Router();

router.post(
  "/create-course",
  auth("superAdmin", "admin"),
  validateRequest(CourseValidations.createCourseValidationSchema),
  CourseControllers.createCourse
);

router.get(
  "/",
  auth("superAdmin", "admin", "faculty", "student"),
  CourseControllers.getAllCourses
);

router.get(
  "/:id",
  auth("superAdmin", "admin", "faculty", "student"),
  CourseControllers.getSingleCourse
);

router.patch(
  "/:id",
  auth("superAdmin", "admin"),
  validateRequest(CourseValidations.updateCourseValidationSchema),
  CourseControllers.updateCourse
);

router.delete(
  "/:id",
  auth("superAdmin", "admin"),
  CourseControllers.deleteCourse
);

router.put(
  "/:courseId/assign-faculties",
  auth("superAdmin", "admin"),
  validateRequest(CourseValidations.facultiesWithCourseValidationSchema),
  CourseControllers.assignFacultiesWithCourse
);

router.get(
  "/:courseId/get-faculties",
  auth("superAdmin", "admin", "student", "faculty"),
  CourseControllers.getFacultiesWithCourses
);

router.delete(
  "/:courseId/remove-faculties",
  auth("superAdmin", "admin"),
  validateRequest(CourseValidations.facultiesWithCourseValidationSchema),
  CourseControllers.removeFacultiesFromCourse
);

export const CourseRouters = router;
