import { UserServices } from "./user.service";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import { RequestHandler } from "express";

const createStudent = catchAsync(async (req, res) => {
  const { password, student: studentData } = req.body;
  const result = await UserServices.createStudentIntoDB(password, studentData);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Student created successfully!",
    data: result,
  });
});

const createFaculty: RequestHandler = catchAsync(async (req, res, next) => {
  const { password, faculty: facultyData } = req.body;

  const result = await UserServices.createFacultyIntoDB(password, facultyData);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Faculty is created successfully",
    data: result,
  });
});

const createAdmin: RequestHandler = catchAsync(async (req, res, next) => {
  const { password, faculty: adminData } = req.body;

  const result = await UserServices.createAdminIntoDB(password, adminData);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Admin is created successfully",
    data: result,
  });
});

export const UserControllers = { createStudent, createFaculty, createAdmin };
