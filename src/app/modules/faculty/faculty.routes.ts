import express from "express";
import { FacultyControllers } from "./faculty.controller";
import { facultyValidations } from "./faculty.validation";
import validateRequest from "../../middlewares/validationRequest";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "../User/user.constant";

const router = express.Router();

router.get(
  "/",
  auth("superAdmin", "admin","faculty"),
  auth(USER_ROLE.admin, USER_ROLE.faculty),
  FacultyControllers.getAllFaculties
);

router.get(
  "/:id",
  auth("superAdmin", "admin","faculty"),
  FacultyControllers.getSingleFaculty
);

router.patch(
  "/:id",
  auth("superAdmin", "admin"),
  validateRequest(facultyValidations.updateFacultyValidationSchema),
  FacultyControllers.updatedFaculty
);

router.delete(
  "/:id",
  auth("superAdmin", "admin"),
  FacultyControllers.deleteSingleFaculty
);

export const FacultyRouters = router;
