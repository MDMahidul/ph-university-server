import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { SemesterRegistrationService } from './semesterRegistration.service';

const createSemesterRegistration = catchAsync(async (req, res) => {
  const result =
    await SemesterRegistrationService.createSemesterRegistrationIntoDB(
      req.body,
    );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Semester regitration added successfully!',
    data: result,
  });
});

const getAllSemesterRegistrations = catchAsync(async (req, res) => {
  const result =
    await SemesterRegistrationService.getAllSemesterRegistrationsFromDB(
      req.body,
    );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Semester registration retrieved successfully!',
    data: result,
  });
});

const getSingleSemesterRegistration = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result =
    await SemesterRegistrationService.getSingleSemesterRegistrationsFromDB(id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Semester registration is retrieved successfully!',
    data: result,
  });
});

const updateSemesterRegistration = catchAsync(async (req, res) => {

});

const deleteSemesterRegistration = catchAsync(async (req, res) => {});

export const SemesterRegistrationController = {
  createSemesterRegistration,
  getAllSemesterRegistrations,
  getSingleSemesterRegistration,
  updateSemesterRegistration,
  deleteSemesterRegistration,
};
