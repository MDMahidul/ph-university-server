import mongoose from "mongoose";
import config from "../../config";
import { AcademicSemester } from "../academicSemister/academicSemester.model";
import { TStudent } from "../student/student.interface";
import { Student } from "../student/student.model";
import { TUser } from "./user.interface";
import { User } from "./user.model";
import {
  generateAdminId,
  generateFacultyId,
  generateStudentId,
} from "./user.utils";
import AppError from "../../errors/Apperror";
import httpStatus from "http-status";
import { Faculty } from "../faculty/faculty.model";
import { TFaculty } from "../faculty/faculty.interface";
import { AcademicDepartment } from "../academicDepartment/academicDepartment.model";
import { AcademicFaculty } from "../academicFaculty/academicFaculty.model";
import { Admin } from "../admin/admin.model";

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

const createFacultyIntoDB = async (password: string, payload: TFaculty) => {
  // create a user object
  const userData: Partial<TUser> = {};

  // if password is not give use default password
  userData.password = password || (config.default_password as string);

  // set faculty role
  userData.role = "faculty";

  // find academic department info
  const academicDepartment = await AcademicDepartment.findById(
    payload.academicDepartment
  );

  if (!academicDepartment) {
    throw new AppError(400, "Academic department not found");
  }

  // find academic faculty info
  /*  const academicFaculty = await AcademicFaculty.findById(
    payload.academicFaculty
  );

  if (!academicFaculty) {
    throw new AppError(400, "Academic faculty not found");
  } */

  // create session
  const session = await mongoose.startSession();
  try {
    // start transaction
    session.startTransaction();

    // set generated id
    userData.id = await generateFacultyId();
    const newUser = await User.create([userData], { session });

    // create a faculty
    if (!newUser.length) {
      throw new AppError(httpStatus.BAD_REQUEST, "Failed to create user!");
    }

    // set id ,_id as user
    payload.id = newUser[0].id;
    payload.user = newUser[0]._id; //reference _id

    // create a faculty (transaction-2)

    const newFaculty = await Faculty.create([payload], { session });

    if (!newFaculty.length) {
      throw new AppError(httpStatus.BAD_REQUEST, "Failed to create faculty");
    }

    await session.commitTransaction();
    await session.endSession();

    return newFaculty;
  } catch (err: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(err);
  }
};

const createAdminIntoDB = async (password: string, payload: TFaculty) => {
  // create a user object
  const userData: Partial<TUser> = {};

  // if password is not give use default password
  userData.password = password || (config.default_password as string);

  // set faculty role
  userData.role = "admin";

  // create session
  const session = await mongoose.startSession();
  try {
    // start transaction
    session.startTransaction();

    // set generated id
    userData.id = await generateAdminId();
    const newUser = await User.create([userData], { session });

    // create a faculty
    if (!newUser.length) {
      throw new AppError(httpStatus.BAD_REQUEST, "Failed to create user!");
    }

    // set id ,_id as user
    payload.id = newUser[0].id;
    payload.user = newUser[0]._id; //reference _id

    // create a faculty (transaction-2)

    const newAdmin = await Admin.create([payload], { session });

    if (!newAdmin.length) {
      throw new AppError(httpStatus.BAD_REQUEST, "Failed to create Admin!");
    }

    await session.commitTransaction();
    await session.endSession();

    return newAdmin;
  } catch (err: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(err);
  }
};

export const UserServices = {
  createStudentIntoDB,
  createFacultyIntoDB,
  createAdminIntoDB,
};
