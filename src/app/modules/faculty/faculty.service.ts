import httpStatus from "http-status";
import QueryBuilder from "../../builder/QueryBuilder";
import { User } from "../User/user.model";
import { FacultySearchableFields } from "./faculty.constant";
import { TFaculty } from "./faculty.interface";
import { Faculty } from "./faculty.model";
import mongoose from "mongoose";
import AppError from "../../errors/AppError";

const getAllFacultiesFromDB = async (query: Record<string, unknown>) => {
  const facultyQuery = new QueryBuilder(
    Faculty.find().populate("academicDepartment academicFaculty"),
    query
  )
    .search(FacultySearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await facultyQuery.modelQuery;
  const meta = await facultyQuery.countTotal();

  return {
    result,
    meta,
  };
};

const getSingleFacultyFromDB = async (id: string) => {
  const result = await Faculty.findById(id)
    .populate("academicDepartment")
    .populate("academicFaculty");

  return result;
};

const updateFacultyIntoDB = async (id: string, payload: Partial<TFaculty>) => {
  // get the non ptimitive data
  const { name, ...remainingFacultyData } = payload;

  const modifiedUpdatedData: Record<string, unknown> = {
    ...remainingFacultyData,
  };

  if (name && Object.keys(name).length) {
    for (const [key, value] of Object.entries(name)) {
      modifiedUpdatedData[`name.${key}`] = value;
    }
  }

  const result = await Faculty.findByIdAndUpdate(id, modifiedUpdatedData, {
    new: true,
    runValidators: true,
  });
  return result;
};

const deleteSingleFacultyFormDB = async (id: string) => {
  /*   const isFacultyExist = await Faculty.findById(id);
  const isUserExist = await User.findById(id);

  if (!isFacultyExist && !isUserExist) {
    throw new AppError(httpStatus.NOT_FOUND, 'Faculty not found!');
  } */

  // start session
  const session = await mongoose.startSession();

  try {
    // start transaction
    session.startTransaction();
    const deletedFaculty = await Faculty.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true, session }
    );

    if (!deletedFaculty) {
      throw new AppError(httpStatus.BAD_REQUEST, "Failed to delete faculty!");
    }

    // get user _id from deletedFaculty
    const userId = deletedFaculty.user;

    const deletedUser = await User.findByIdAndUpdate(
      userId,
      { isDeleted: true },
      { new: true, session }
    );

    if (!deletedUser) {
      throw new AppError(httpStatus.BAD_REQUEST, "Failed to delete user");
    }

    // commit transaction if successed
    await session.commitTransaction();

    //end session if successes
    await session.endSession();

    return deletedUser;
  } catch (error) {
    // abort transaction if failed
    await session.abortTransaction();

    //end session if failed
    await session.endSession();

    throw new AppError(httpStatus.BAD_REQUEST, "Failed to delete Faculty");
  }
};

export const FacultyServices = {
  getAllFacultiesFromDB,
  getSingleFacultyFromDB,
  updateFacultyIntoDB,
  deleteSingleFacultyFormDB,
};
