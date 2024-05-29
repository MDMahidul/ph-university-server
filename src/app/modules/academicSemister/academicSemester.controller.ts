import { RequestHandler } from "express";
import catchAsync from "../../utils/catchAsync";
import { AcademicSemesterServices } from "./academicSemester.service";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";


const createAcademicSemester : RequestHandler= catchAsync(
    async(req,res)=>{
        const result = await AcademicSemesterServices.createAcademicSemesterIntoDB(req.body);

        sendResponse(res, {
          success: true,
          statusCode: httpStatus.OK,
          message: "Academic semseter is created successfully",
          data: result,
        });
    }
)

export const AcademicSemesterControllers={
    createAcademicSemester
}