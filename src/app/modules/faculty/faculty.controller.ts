import { RequestHandler } from 'express';
import catchAsync from '../../utils/catchAsync';
import { FacultyServices } from './faculty.service';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';

const getAllFaculties: RequestHandler = catchAsync(async (req, res) => {
  const result = await FacultyServices.getAllFacultiesFromDB(req.query);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Faculties data retrieved successfully!',
    data: result,
  });
});

const getSingleFaculty = catchAsync(async (req, res) => {
  const { facultyId } = req.params;

  const result = await FacultyServices.getSingleFacultyFromDB(facultyId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Faculty data retrieved successfully!',
    data: result,
  });
});

const updatedFaculty = catchAsync(async (req, res) => {
  const { facultyId } = req.params;
  const { faculty } = req.body;
  const result = await FacultyServices.updateFacultyIntoDB(
    facultyId,
    faculty,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Faculty data updated successfully!',
    data: result,
  });
});

const deleteSingleFaculty = catchAsync(async (req, res) => {
  const { facultyId } = req.params;
  const result = await FacultyServices.deleteSingleFacultyFormDB(facultyId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Faculty data deleted  successfully!',
    data: result,
  });
});

export const FacultyControllers = {
  getAllFaculties,
  getSingleFaculty,
  updatedFaculty,
  deleteSingleFaculty,
};
