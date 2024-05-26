import { Request, Response } from "express";
//import studentValidationSchema from "../student/student.validation";
import { UserServices } from "./user.service";

const createStudent = async (req: Request, res: Response) => {
  try {
    const { password, student: studentData } = req.body;
    //zod validation check
    //const zodparseData = studentValidationSchema.parse(studentData)

    const result = await UserServices.createStudentIntoDB(
      password,
      studentData
    );

    res.status(200).json({
      success: true,
      message: "Student created successfully!",
      data: result,
    });
  } catch (error: unknown) {
    res.status(500).json({
      success: false,
      message: "Something went wrong!",
      error: error,
    });
  }
};

export const UserControllers = { createStudent };
