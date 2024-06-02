import httpStatus from "http-status";
import AppError from "../../errors/Apperror";
import { User } from "../user/user.model";
import { Student } from "./student.model";
import mongoose from "mongoose";

const getAllStudentsFromDB = async () => {
  const result = await Student.find()
    .populate("admissionSemester")
    .populate({
      path: "academicDepartment",
      populate: {
        path: "academicFaculty",
      },
    });

  return result;
};

const getSingleStudentFromDB = async (id: string) => {
  const result = await Student.findOne({ id })
    .populate("admissionSemester")
    .populate({
      path: "academicDepartment",
      populate: {
        path: "academicFaculty",
      },
    });

  return result;
};

const deleteSingleStudentFromDB = async (id: string) => {
  const isStudentExist = await Student.findOne({ id });
  const isUserExist = await User.findOne({ id });
  if (!isStudentExist || !isUserExist) {
    throw new AppError(httpStatus.NOT_FOUND, "Student not found!");
  }
  // start session
  const session = await mongoose.startSession();
  try {
    // start transaction
    session.startTransaction();
    const deletedStudent = await Student.findOneAndUpdate(
      { id },
      { isDeleted: true },
      { new: true, session }
    );
    // check if student delete status updated or no
    if (!deletedStudent) {
      throw new AppError(httpStatus.BAD_REQUEST, "Failed to delete student!");
    }
    const deleteUser = await User.findOneAndUpdate(
      { id },
      { isDeleted: true },
      { new: true, session }
    );
     if (!deleteUser) {
       throw new AppError(httpStatus.BAD_REQUEST, "Failed to delete user!");
     }

     // commit transaction if successed
     await session.commitTransaction();
     // end session if successed
     await session.endSession();
    return deletedStudent;
  } catch (error) {
    // abort transaction if failed
    await session.abortTransaction();
    // end session if successed
    await session.endSession();
  }
};

export const StudentServices = {
  getAllStudentsFromDB,
  getSingleStudentFromDB,
  deleteSingleStudentFromDB,
};
