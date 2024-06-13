import httpStatus from "http-status";
import { TLoginUser } from "./auth.interface";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../../config";
import AppError from "../../errors/Apperror";
import { User } from "../user/user.model";
import bcrypt from "bcrypt";

const loginUser = async (payload: TLoginUser) => {
  // check if the user is exists
  const user = await User.isUserExistsByCustomId(payload.id);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "This user is not found!");
  }

  // check if the user already deleted
  const isDelete = user?.isDeleted;

  if (isDelete) {
    throw new AppError(httpStatus.FORBIDDEN, "This user is deleted!");
  }

  // check if the user already deleted
  const userStatus = user?.status === "blocked";

  if (userStatus) {
    throw new AppError(httpStatus.FORBIDDEN, "This user is blocked!");
  }

  // check if the password is correct
  if (!(await User.isPasswordMatched(payload?.password, user?.password))) {
    throw new AppError(httpStatus.FORBIDDEN, "Password do not matched!");
  }

  // create token and sent to the client
  const jwtPayload = {
    userId: user?.id,
    role: user?.role,
  };
  const accessToken = jwt.sign(jwtPayload, config.jwt_access_secret as string, {
    expiresIn: "10d",
  });

  return {
    accessToken,
    needsPasswordChange: user?.needsPasswordChange,
  };
};

const changePassword = async (
  userData: JwtPayload,
  payload: { oldPassword: string; newPassword: string }
) => {
  // check if the user exists
  const user = await User.isUserExistsByCustomId(userData.userId);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "This user is not found!");
  }

  // check if the user already deleted
  const isDelete = user?.isDeleted;

  if (isDelete) {
    throw new AppError(httpStatus.FORBIDDEN, "This user is deleted!");
  }

  // check if the user blocked
  const userStatus = user?.status === "blocked";

  if (userStatus) {
    throw new AppError(httpStatus.FORBIDDEN, "This user is blocked!");
  }

  // check if the password is correct
  if (!(await User.isPasswordMatched(payload.oldPassword, user?.password))) {
    throw new AppError(httpStatus.FORBIDDEN, "Password do not matched!");
  }

  // hashing new password
  const newHashedPassword = await bcrypt.hash(
    payload.newPassword,
    Number(config.bcrypt_salt_rounds)
  );

  // update password and status
  await User.findOneAndUpdate(
    { id: userData.userId, role: userData.role },
    {
      password: newHashedPassword,
      needsPasswordChange: false,
      passwordChnagedAt: new Date(),
    }
  );

  return null;
};

export const AuthServices = { loginUser, changePassword };
