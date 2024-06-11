import { RequestHandler } from "express";
import catchAsync from "../../utils/catchAsync";
import { OfferedCourseServices } from "./offeredCourse.service";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";

const createOfferedCourse:RequestHandler = catchAsync(async (req,res)=>{
     const result = await OfferedCourseServices.createOfferedCourseIntoDB(req.body);

     sendResponse(res, {
       success: true,
       statusCode: httpStatus.OK,
       message: 'Offered course created successfully!',
       data: result,
     });
})

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

export const OfferedCourseControllers = {
  createOfferedCourse,
  updateOfferedCourse,
};