import express from "express";
import { SemesterRegistrationController } from "./semesterRegistration.controller";
import { SemesterRegistrationValidations } from "./semesterRegistration.validation";
import validateRequest from "../../middlewares/validationRequest";
import auth from "../../middlewares/auth";

const router = express.Router();

router.post(
  "/create-semester-registration",
  auth("superAdmin", "admin"),
  validateRequest(
    SemesterRegistrationValidations.createSemesterRegistrationValidationSchema
  ),
  SemesterRegistrationController.createSemesterRegistration
);

router.get(
  "/:id",
  auth("superAdmin", "admin", "faculty", "student"),
  SemesterRegistrationController.getSingleSemesterRegistration
);

router.patch(
  "/:id",
  auth("superAdmin", "admin"),
  validateRequest(
    SemesterRegistrationValidations.upadateSemesterRegistrationValidationSchema
  ),
  SemesterRegistrationController.updateSemesterRegistration
);

router.delete(
  "/:id",
  auth("superAdmin", "admin"),
  SemesterRegistrationController.deleteSemesterRegistration
);

router.get(
  "/",
  auth("superAdmin", "admin", "faculty", "student"),
  SemesterRegistrationController.getAllSemesterRegistrations
);

export const semesterRegistrationRoutes = router;
