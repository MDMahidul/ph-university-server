import { UserServices } from "./user.service";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import { RequestHandler } from "express";

const createStudent = catchAsync(async (req, res) => {
  const { password, student: studentData } = req.body;
  const result = await UserServices.createStudentIntoDB(req.file,password, studentData);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Student created successfully!",
    data: result,
  });
});

const createFaculty: RequestHandler = catchAsync(async (req, res, next) => {
  const { password, faculty: facultyData } = req.body;

  const result = await UserServices.createFacultyIntoDB(
    req.file,
    password,
    facultyData
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Faculty is created successfully",
    data: result,
  });
});

const createAdmin: RequestHandler = catchAsync(async (req, res, next) => {
  const { password, faculty: adminData } = req.body;

  const result = await UserServices.createAdminIntoDB(
    req.file,
    password,
    adminData
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Admin is created successfully",
    data: result,
  });
});

const getMe: RequestHandler = catchAsync(async (req, res, next) => {
  /* const token = req.headers.authorization;
  if(!token){
    throw new AppError(httpStatus.NOT_FOUND,'Token not found!')
  } */

  const { userId, role } = req.user;

  const result = await UserServices.getMe(userId, role);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "User data retrived successfully!",
    data: result,
  });
});

const changeStatus = catchAsync(async (req, res) => {
  const id = req.params.id;

  const result = await UserServices.changeStatus(id, req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "User blocked successfully!",
    data: result,
  });
});

export const UserControllers = {
  createStudent,
  createFaculty,
  createAdmin,
  changeStatus,getMe
};
