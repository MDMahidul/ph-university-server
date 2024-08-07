/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose from "mongoose";
import config from "../../config";
import { TStudent } from "../Student/student.interface";
import { Student } from "../Student/student.model";
import { TUser } from "./user.interface";
import { User } from "./user.model";
import {
  generateAdminId,
  generateFacultyId,
  generateStudentId,
} from "./user.utils";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";
import { TFaculty } from "../Faculty/faculty.interface";
import { AcademicDepartment } from "../AcademicDepartment/academicDepartment.model";
//import { AcademicFaculty } from "../academicFaculty/academicFaculty.model";
import { Faculty } from "../Faculty/faculty.model";
import { Admin } from "../Admin/admin.model";
import { AcademicSemester } from "../AcademicSemester/academicSemester.model";
import { sendImageToCloudinary } from "../../utils/sendImageToCloudinary";
import { TAdmin } from "../Admin/admin.interface";

const createStudentIntoDB = async (
  file: any,
  password: string,
  payload: TStudent
) => {
  // create a user object
  const userData: Partial<TUser> = {};

  // if password is not give use default password
  userData.password = password || (config.default_password as string);

  // set student role
  userData.role = "student";
  userData.email = payload.email;

  //find academic semester info
  const admissionSemester = await AcademicSemester.findById(
    payload.admissionSemester
  );

  if (!admissionSemester) {
    throw new AppError(400, "Admission semester not found");
  }

  // find department
  const academicDepartment = await AcademicDepartment.findById(
    payload.academicDepartment
  );

  if (!academicDepartment) {
    throw new AppError(400, "Aademic department not found");
  }
  payload.academicFaculty = academicDepartment.academicFaculty;

  // implement transaction
  //setp 1: create session
  const session = await mongoose.startSession();

  try {
    //step 2: start transaction
    session.startTransaction();

    // set generated id
    userData.id = await generateStudentId(admissionSemester);

    if (file) {
      const imageName = `${userData.id}${payload?.name?.firstName}`;
      const path = file?.path;

      //send imgae to cloudinary
      const { secure_url } = await sendImageToCloudinary(imageName, path);

      payload.profileImage = secure_url as string;
    }

    //create a user (transaction-1)
    const newUser = await User.create([userData], { session }); //array

    //create a user
    if (!newUser.length) {
      throw new AppError(httpStatus.BAD_REQUEST, "Failed to create user!");
    }
    //set id, _id as user
    payload.id = newUser[0].id;
    payload.user = newUser[0]._id; // reference _id
    //payload.profileImage = secure_url;

    //create a user (transaction-2)
    const newStudent = await Student.create([payload], { session });

    if (!newStudent.length) {
      throw new AppError(httpStatus.BAD_REQUEST, "Failed to create student!");
    }
    // step 3: commit session if success
    await session.commitTransaction();

    // step 4: end session if success
    await session.endSession();

    return newStudent;
  } catch (error) {
    //step 3: abbort session if error happend
    await session.abortTransaction();
    //step 4: end session
    console.log(error);
    await session.endSession();
    throw new AppError(httpStatus.BAD_REQUEST, "Failed to create student");
  }
};

const createFacultyIntoDB = async (
  file: any,
  password: string,
  payload: TFaculty
) => {
  // Create a user object
  const userData: Partial<TUser> = {};

  // If password is not given, use default password
  userData.password = password || (config.default_password as string);

  // Set faculty role
  userData.role = "faculty";
  userData.email = payload.email;

  try {
    // Find academic department info
    const academicDepartment = await AcademicDepartment.findById(
      payload.academicDepartment
    );

    if (!academicDepartment) {
      throw new AppError(400, "Academic department not found");
    }

    payload.academicFaculty = academicDepartment.academicFaculty;

    // Create session
    const session = await mongoose.startSession();

    try {
      // Start transaction
      session.startTransaction();

      // Set generated ID
      userData.id = await generateFacultyId();

      if (file) {
        const imageName = `${userData.id}${payload.name.firstName}`;
        const path = file.path;
        // Send image to Cloudinary
        const { secure_url } = await sendImageToCloudinary(imageName, path);
        payload.profileImage = secure_url as string;
      }

      // Create a user
      const newUser = await User.create([userData], { session });

      if (!newUser.length) {
        throw new AppError(400, "Failed to create user!");
      }

      // Set ID and _id as user reference
      payload.id = newUser[0].id;
      payload.user = newUser[0]._id; // Reference _id

      // Create a faculty (transaction-2)
      const newFaculty = await Faculty.create([payload], { session });

      if (!newFaculty.length) {
        throw new AppError(400, "Failed to create faculty");
      }

      await session.commitTransaction();
      await session.endSession();

      return newFaculty;
    } catch (error) {
      await session.abortTransaction();
      await session.endSession();
      console.error("Transaction error:", error);
      throw new AppError(400, error.message || "Failed to create Faculty");
    }
  } catch (error) {
    console.error("Outer error:", error);
    throw new AppError(400, error.message || "Failed to create Faculty");
  }
};

const createAdminIntoDB = async (
  file: any,
  password: string,
  payload: TAdmin
) => {
  // create a user object
  const userData: Partial<TUser> = {};

  // if password is not give use default password
  userData.password = password || (config.default_password as string);

  // set admin role
  userData.role = "admin";
  userData.email = payload.email;

  // create session
  const session = await mongoose.startSession();

  try {
    // start transaction
    session.startTransaction();

    // set generated id
    userData.id = await generateAdminId();

    if (file) {
      const imageName = `${userData.id}${payload?.name?.firstName}`;
      const path = file?.path;
      //send imgae to cloudinary
      const { secure_url } = await sendImageToCloudinary(imageName, path);
      payload.profileImage = secure_url as string;
    }

    // create a user
    const newUser = await User.create([userData], { session });

    // create a admin
    if (!newUser.length) {
      throw new AppError(httpStatus.BAD_REQUEST, "Failed to create user!");
    }

    // set id ,_id as user
    payload.id = newUser[0].id;
    payload.user = newUser[0]._id; //reference _id
    //payload.profileImage = secure_url;
    // create a faculty (transaction-2)

    const newAdmin = await Admin.create([payload], { session });

    if (!newAdmin.length) {
      throw new AppError(httpStatus.BAD_REQUEST, "Failed to create Admin!");
    }

    await session.commitTransaction();
    await session.endSession();

    return newAdmin;
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(httpStatus.BAD_REQUEST, "Failed to create student");
  }
};

const getMe = async (userId: string, role: string) => {
  /* const decoded = verifyToken(token, config.jwt_access_secret as string);

  const { userId, role } = decoded;
  console.log(userId, role); */

  let result = null;

  if (role === "student") {
    result = await Student.findOne({ id: userId }).populate("user");
  }

  if (role === "admin") {
    result = await Admin.findOne({ id: userId }).populate("user");
  }

  if (role === "faculty") {
    result = await Faculty.findOne({ id: userId }).populate("user");
  }

  return result;
};

const changeStatus = async (id: string, payload: { status: string }) => {
  const result = await User.findByIdAndUpdate(id, payload, { new: true });

  return result;
};

export const UserServices = {
  createStudentIntoDB,
  createFacultyIntoDB,
  createAdminIntoDB,
  getMe,
  changeStatus,
};
