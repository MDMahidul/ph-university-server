import httpStatus from "http-status";
import AppError from "../../errors/Apperror";
import { User } from "../user/user.model";
import { Student } from "./student.model";
import mongoose from "mongoose";
import { TStudent } from "./student.interface";
import QueryBuilder from "../../builder/QueryBuilder";
import { studentSearchableFields } from "./student.constant";

const getAllStudentsFromDB = async (query: Record<string, unknown>) => {
  const studentQuery = new QueryBuilder(
    Student.find()
      .populate("admissionSemester")
      .populate({
        path: "academicDepartment",
        populate: {
          path: "academicFaculty",
        },
      }),
    query
  )
    .search(studentSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

    const result = await studentQuery.modelQuery;

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

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, "Invalid Student ID!");
  }

  return result;
};

const updateStudentIntoDB = async (id: string, payload: Partial<TStudent>) => {
  // get the non primitive data
  const { name, guardian, localGuardian, ...remainingStudentData } = payload;

  // create a new object initialized with the remaining properties
  const modifiedUpdatedData: Record<string, unknown> = {
    ...remainingStudentData,
  };

  // handle nested objects
  if (name && Object.keys(name).length) {
    for (const [key, value] of Object.entries(name)) {
      modifiedUpdatedData[`name.${key}`] = value;
    }
  }

  if (guardian && Object.keys(guardian).length) {
    for (const [key, value] of Object.entries(guardian)) {
      modifiedUpdatedData[`guardian.${key}`] = value;
    }
  }

  if (localGuardian && Object.keys(localGuardian).length) {
    for (const [key, value] of Object.entries(localGuardian)) {
      modifiedUpdatedData[`localGuardian.${key}`] = value;
    }
  }

  const result = await Student.findOneAndUpdate({ id }, modifiedUpdatedData, {
    new: true,
    runValidators: true,
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
    throw new AppError(httpStatus.BAD_REQUEST, "Failed to delete student");
  }
};

export const StudentServices = {
  getAllStudentsFromDB,
  getSingleStudentFromDB,
  deleteSingleStudentFromDB,
  updateStudentIntoDB,
};
