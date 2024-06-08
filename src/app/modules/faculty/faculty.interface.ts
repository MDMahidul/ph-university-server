import { Model, Types } from "mongoose";

export type TUserName = {
    firstName: string;
    middleName?:string;
    lastName:string;
}
export type TGender = "male" | "female" | "others";

export type TBloodGroup =
  | "A+"
  | "A-"
  | "B+"
  | "B-"
  | "O+"
  | "O-"
  | "AB+"
  | "AB-";

export type TFaculty = {
  id: string;
  user: Types.ObjectId;
  name: TUserName;
  gender: TGender;
  designation:string;
  dateOfBirth: Date;
  email: string;
  contactNo: string;
  emergencyContactNo: string;
  bloodGroup?: TBloodGroup;
  presentAddress: string;
  permanentAddress: string;
  profileImage?: string;
  academicFaculty: Types.ObjectId;
  academicDepartment: Types.ObjectId;
  isDeleted: boolean;
};

export interface FacultyModel extends Model<TFaculty> {
  isUserExists(id: string): Promise<TFaculty | null>;
}