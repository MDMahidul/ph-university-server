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
  const result = await AcademicSemesterServices.getAllAcademicSemesterFromDB();

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "All Academic semseters is retrived successfully!",
    data: result,
  });
});
const getSingleAcademicSemester: RequestHandler = catchAsync(
  async (req, res) => {
    const { semesterId } = req.params;
    console.log(semesterId);
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

const updateSingleAcademicSemester: RequestHandler=catchAsync(
    async(req,res)=>{
        const {semesterId}=req.params;
        const semesterUpdatedData=req.body;

        const result = await AcademicSemesterServices.updateSingleAcademicSemesterIntoDB(semesterId,semesterUpdatedData)
    }
)

export const AcademicSemesterControllers = {
  createAcademicSemester,
  getAllAcademicSemester,
  getSingleAcademicSemester,
  updateSingleAcademicSemester,
};
