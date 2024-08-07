import express, { NextFunction, Request, Response } from "express";
import { UserControllers } from "./user.controller";
import validateRequest from "../../middlewares/validationRequest";
import { studentValidations } from "../Student/student.validation";
import { facultyValidations } from "../Faculty/faculty.validation";
import { adminValidations } from "../Admin/admin.validation";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "./user.constant";
import { UserValidation } from "./user.validation";
import { upload } from "../../utils/sendImageToCloudinary";

const router = express.Router();

router.post(
  "/create-student",
  auth(USER_ROLE.admin),
  upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    next();
  },
  validateRequest(studentValidations.createStudentValidationSchema),
  UserControllers.createStudent
);

router.post(
  "/create-faculty",
  upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    next();
  },
  auth(USER_ROLE.admin),
  validateRequest(facultyValidations.createFacultyValidationSchema),
  UserControllers.createFaculty
);

router.post(
  "/create-admin",
  upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    next();
  },
  validateRequest(adminValidations.createAdminValidationSchema),
  UserControllers.createAdmin
);

router.patch(
  "/change-status/:id",
  auth("admin"),
  validateRequest(UserValidation.changeStatusValidationSchema),
  UserControllers.changeStatus
);

router.get("/me", auth("student", "admin", "faculty"), UserControllers.getMe);

export const UserRoutes = router;
