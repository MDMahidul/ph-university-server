import express from "express";
import { StudentController } from "./student.controller";
import validateRequest from "../../middlewares/validationRequest";
import { studentValidations } from "./student.validation";

const router = express.Router();

//will call controller function
//router.post('/create-student', StudentController.createStudent);

router.get("/", StudentController.getAllStudents);

router.get("/:studentId", StudentController.getSingleStudent);

router.patch(
  "/:studentId",
  validateRequest(studentValidations.updateStudentValidationSchema),
  StudentController.updateStudent
);

router.delete("/:studentId", StudentController.deleteSingleStudent);

export const StudentRoutes = router;
