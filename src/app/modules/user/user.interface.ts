import { Model } from "mongoose";
import { USER_ROLE } from "./user.constant";

export type TUser = {
  id: string;
  password: string;
  needsPasswordChange: boolean;
  role: "admin" | "student" | "faculty";
  status: "in-progress" | "blocked";
  isDeleted: boolean;
};

// function defination
export interface UserModel extends Model<TUser> {
  isUserExistsByCustomId(id: string): Promise<TUser>;
  
  isPasswordMatched(palinTextPassword:string, hashedPassword:string): Promise<boolean>;
}
export type TUserRole = keyof typeof USER_ROLE;