import httpStatus from 'http-status';
import QueryBuilder from '../../builder/QueryBuilder';
import { User } from '../user/user.model';
import { AdminSearchableFields } from './admin.constant';
import { TAdmin } from './admin.interface';
import { Admin } from './admin.model';
import mongoose from 'mongoose';
import AppError from '../../errors/Apperror';

const getAllAdminFromDB = async (query: Record<string, unknown>) => {
  const adminQuery = new QueryBuilder(Admin.find(), query)
    .search(AdminSearchableFields)
    .sort()
    .filter()
    .paginate()
    .fields();

  const result = await adminQuery.modelQuery;

  return result;
};

const getSingleAdminFromDB = async (id: string) => {
  const result = await Admin.findById(id);
  return result;
};

const updateAdminIntoDB = async (id: string, payload: Partial<TAdmin>) => {
  const { name, ...remainingAdminData } = payload;

  const modifiedUpdatedData: Record<string, unknown> = {
    ...remainingAdminData,
  };

  if (name && Object.keys(name).length) {
    for (const [key, value] of Object.entries(name)) {
      modifiedUpdatedData[`name.${key}`] = value;
    }
  }

  const result = await Admin.findByIdAndUpdate(id , modifiedUpdatedData, {
    new: true,
    runValidators: true,
  });
  return result;
};

const deleteAdminFromDB = async (id: string) => {
  const isAdminExist = await Admin.findById(id);
  const isUserExist = await User.findById(id);

  if (!isAdminExist && !isUserExist) {
    throw new AppError(httpStatus.NOT_FOUND, 'Admin not found!');
  }

  // start session
  const session = await mongoose.startSession();
  try {
    // start transaction
    session.startTransaction();
    const deletedAdmin = await Admin.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true, session },
    );

    if (!deletedAdmin) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete Admin!');
    }

    // get user _id from deletedFaculty
    const userId = deletedAdmin.user;

    const deletedUser = await User.findByIdAndUpdate(
      userId,
      { isDeleted: true },
      { new: true, session },
    );

    if (!deletedUser) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete user');
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

    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete Admin');
  }
};

export const AdminServices = {
  getAllAdminFromDB,
  getSingleAdminFromDB,
  updateAdminIntoDB,
  deleteAdminFromDB,
};
