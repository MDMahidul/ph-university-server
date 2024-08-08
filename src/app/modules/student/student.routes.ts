import express from "express";
import { StudentController } from "./student.controller";
import validateRequest from "../../middlewares/validationRequest";
import { studentValidations } from "./student.validation";
import auth from "../../middlewares/auth";

const router = express.Router();

router.get("/", auth("superAdmin", "admin"), StudentController.getAllStudents);

router.get(
  "/:id",
  auth("student", "admin", "faculty"),
  StudentController.getSingleStudent
);

router.patch(
  "/:id",
  auth("superAdmin", "admin"),
  validateRequest(studentValidations.updateStudentValidationSchema),
  StudentController.updateStudent
);

router.delete(
  "/:id",
  auth("superAdmin", "admin"),
  StudentController.deleteSingleStudent
);

export const StudentRoutes = router;
