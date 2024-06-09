import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { AdminServices } from "./admin.service";
import { RequestHandler } from "express";


const getAllAdmin:RequestHandler = catchAsync(async(req,res)=>{
    const result = await AdminServices.getAllAdminFromDB(req.query);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'Admins data retrieved successfully!',
      data: result,
    });
})

const getSingleAdmin = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await AdminServices.getSingleAdminFromDB(id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Admin data retrieved successfully!',
    data: result,
  });
});

const updatedAdmin = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { admin } = req.body;
  const result = await AdminServices.updateAdminIntoDB(id, admin);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Admin data updated successfully!',
    data: result,
  });
});

const deleteSingleAdmin = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await AdminServices.deleteAdminFromDB(id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Admin data deleted  successfully!',
    data: result,
  });
});

export const AdminControllers = {
  getAllAdmin,
  getSingleAdmin,
  updatedAdmin,
  deleteSingleAdmin,
};
