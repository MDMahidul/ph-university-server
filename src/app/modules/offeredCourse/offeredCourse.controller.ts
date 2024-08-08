import { RequestHandler } from "express";
import catchAsync from "../../utils/catchAsync";
import { OfferedCourseServices } from "./offeredCourse.service";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";

const getAllOfferedCourses: RequestHandler = catchAsync(async (req, res) => {
  const result = await OfferedCourseServices.getAllOfferedCoursesFromDB(
    req.query
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "OfferedCourses retrieved successfully !",
    meta: result.meta,
    data: result.result,
  });
});

const getMyOfferedCourses: RequestHandler = catchAsync(async (req, res) => {
  const userId=req.user.userId;
  const result =
    await OfferedCourseServices.getMyOfferedCoursesFromDB(userId,req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Offered courses are retrieved successfully !",
    meta: result.meta,
    data: result.result,
  });
});

const getSingleOfferedCourses: RequestHandler = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await OfferedCourseServices.getSingleOfferedCourseFromDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "OfferedCourse fetched successfully",
    data: result,
  });
});

const createOfferedCourse: RequestHandler = catchAsync(async (req, res) => {
  const result = await OfferedCourseServices.createOfferedCourseIntoDB(
    req.body
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Offered course created successfully!",
    data: result,
  });
});

const updateOfferedCourse: RequestHandler = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await OfferedCourseServices.updateOfferedCourseIntoDB(
    id,
    req.body
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Offered course updated successfully!",
    data: result,
  });
});

const deleteOfferedCourse: RequestHandler = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await OfferedCourseServices.deleteOfferedCourseFromDB(id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Offered course deleted successfully!",
    data: result,
  });
});

export const OfferedCourseControllers = {
  createOfferedCourse,
  updateOfferedCourse,
  getAllOfferedCourses,
  getSingleOfferedCourses,
  deleteOfferedCourse,
  getMyOfferedCourses,
};
