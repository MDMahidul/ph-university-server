import express from "express";
import { StudentController } from "./student.controller";
import validateRequest from "../../middlewares/validationRequest";
import { studentValidations } from "./student.validation";
import auth from "../../middlewares/auth";

const router = express.Router();

//will call controller function
//router.post('/create-student', StudentController.createStudent);

router.get("/", StudentController.getAllStudents);

router.get(
  "/:id",
  auth("student", "admin", "faculty"),
  StudentController.getSingleStudent
);

router.patch(
  "/:id",
  validateRequest(studentValidations.updateStudentValidationSchema),
  StudentController.updateStudent
);

router.delete("/:id", StudentController.deleteSingleStudent);

export const StudentRoutes = router;
