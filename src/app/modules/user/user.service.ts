import mongoose from "mongoose";
import config from "../../config";
import { AcademicSemester } from "../academicSemister/academicSemester.model";
import { TStudent } from "../student/student.interface";
import { Student } from "../student/student.model";
import { TUser } from "./user.interface";
import { User } from "./user.model";
import { generateStudentId } from "./user.utils";
import AppError from "../../errors/Apperror";
import httpStatus from "http-status";

const createStudentIntoDB = async (password: string, payload: TStudent) => {
  // create a user object using partial
  const userData: Partial<TUser> = {};

  // check if password is given or not, if not use default pass
  userData.password = password || (config.default_password as string);

  // set student role
  userData.role = "student";

  //find academic semester info
  const admissionSemester = await AcademicSemester.findById(
    payload.admissionSemester
  );

  // implement transaction
  // step 1: create session
  const session = await mongoose.startSession();
  try {
    // step 2: start transaction
    await session.startTransaction();

    // set generate id
    userData.id = await generateStudentId(admissionSemester);

    // create a user transaction
    const newUser = await User.create([userData], { session }); //array

    if (!newUser.length) {
      throw new AppError(httpStatus.BAD_REQUEST, "Failed to create user!");
    }
    // set id, _id as user
    payload.id = newUser[0].id;
    payload.user = newUser[0]._id; // reference _id

    // create student (transaction - 2)
    const newStudent = await Student.create([payload], { session });

    if (!newStudent.length) {
      throw new AppError(httpStatus.BAD_REQUEST, "Failed to create student!");
    }
    // step 3: commit transaction if transaction successed
    await session.commitTransaction();

    // step 4: end session if successed
    await session.endSession();

    return newStudent;
  } catch (error) {
    // step 3: abort transaction if error happend
    await session.abortTransaction();

    //step 4: end session
    await session.endSession();
    throw new AppError(httpStatus.BAD_REQUEST, "Failed to create student");
  }
};

export const UserServices = {
  createStudentIntoDB,
};
