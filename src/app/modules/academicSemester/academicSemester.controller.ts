import { RequestHandler } from "express";
import catchAsync from "../../utils/catchAsync";
import { AcademicSemesterServices } from "./academicSemester.service";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";

const createAcademicSemester: RequestHandler = catchAsync(async (req, res) => {
  const result = await AcademicSemesterServices.createAcademicSemesterIntoDB(
    req.body
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Academic semseter is created successfully",
    data: result,
  });
});

const getAllAcademicSemester: RequestHandler = catchAsync(async (req, res) => {
  const result = await AcademicSemesterServices.getAllAcademicSemesterFromDB(
    req.query
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "All Academic semseters is retrived successfully!",
    meta: result.meta,
    data: result.result,
  });
});

const getSingleAcademicSemester: RequestHandler = catchAsync(
  async (req, res) => {
    const { semesterId } = req.params;

    const result =
      await AcademicSemesterServices.getSingleAcademicSemesterFrom(semesterId);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Academic semseter is retrived successfully!",
      data: result,
    });
  }
);

const updateSingleAcademicSemester = catchAsync(async (req, res) => {
  const { semesterId } = req.params;
  const semesterUpdatedData = req.body;

  const result =
    await AcademicSemesterServices.updateSingleAcademicSemesterIntoDB(
      semesterId,
      semesterUpdatedData
    );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Academic department is updated successfully!",
    data: result,
  });
});

export const AcademicSemesterControllers = {
  createAcademicSemester,
  getAllAcademicSemester,
  getSingleAcademicSemester,
  updateSingleAcademicSemester,
};
