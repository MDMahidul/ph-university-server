import express from "express";
import validateRequest from "../../middlewares/validationRequest";
import { AcademicFacultyValidation } from "./academicFaculty.validation";
import { AcademicFacultyControllers } from "./academicFaculty.controller";
import auth from "../../middlewares/auth";

const router = express.Router();

router.post(
  "/create-academic-faculty",
  auth("superAdmin", "admin"),
  validateRequest(
    AcademicFacultyValidation.createAcademicFacultyValidationSchema
  ),
  AcademicFacultyControllers.createAcademicFaculty
);

router.get(
  "/",
  auth("superAdmin", "admin", "faculty", "student"),
  AcademicFacultyControllers.getAllAcademicFaculty
);

router.get(
  "/:facultyId",
  auth("superAdmin", "admin", "faculty", "student"),
  AcademicFacultyControllers.getSingleAcademicFaculty
);

router.patch(
  "/:facultyId",
  auth("superAdmin", "admin", "faculty", "student"),
  validateRequest(
    AcademicFacultyValidation.updateAcademicFacultyValidationSchema
  ),
  AcademicFacultyControllers.updateSingleAcademicFaculty
);

export const AcademicFacultyRouters = router;
