import express from "express";
import { UserControllers } from "./user.controller";
import validateRequest from "../../middlewares/validationRequest";
import { studentValidations } from "../student/student.validation";
import { facultyValidations } from "../faculty/faculty.validation";
import { adminValidations } from "../admin/admin.validation";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "./user.constant";
import { UserValidation } from "./user.validation";

const router = express.Router();

router.post(
  "/create-student",
  auth(USER_ROLE.admin),
  validateRequest(studentValidations.createStudentValidationSchema),
  UserControllers.createStudent
);

router.post(
  "/create-faculty",
  auth(USER_ROLE.admin),
  validateRequest(facultyValidations.createFacultyValidationSchema),
  UserControllers.createFaculty
);

router.post(
  "/create-admin",
  validateRequest(adminValidations.createAdminValidationSchema),
  UserControllers.createAdmin
);

router.post(
  "/change-status/:id",
  auth("admin"),
  validateRequest(UserValidation.changeStatusValidationSchema),
  UserControllers.changeStatus
);

router.get("/me", auth("student", "admin", "faculty"), UserControllers.getMe);

export const UserRoutes = router;
