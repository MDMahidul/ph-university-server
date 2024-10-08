import { RequestHandler } from "express";
import catchAsync from "../../utils/catchAsync";
import { FacultyServices } from "./faculty.service";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";

const getAllFaculties: RequestHandler = catchAsync(async (req, res) => {
 
  const result = await FacultyServices.getAllFacultiesFromDB(req.query);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Faculties data retrieved successfully!",
    meta: result.meta,
    data: result.result,
  });
});

const getSingleFaculty = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await FacultyServices.getSingleFacultyFromDB(id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Faculty data retrieved successfully!",
    data: result,
  });
});

const updatedFaculty = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { faculty } = req.body;
  const result = await FacultyServices.updateFacultyIntoDB(id, faculty);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Faculty data updated successfully!",
    data: result,
  });
});

const deleteSingleFaculty = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await FacultyServices.deleteSingleFacultyFormDB(id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Faculty data deleted  successfully!",
    data: result,
  });
});

export const FacultyControllers = {
  getAllFaculties,
  getSingleFaculty,
  updatedFaculty,
  deleteSingleFaculty,
};
