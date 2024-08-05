import { TBloodGroup, TDesignation, TGender } from "./admin.interface";

export const Gender: TGender[] = ["male", "female", "others"];

export const BloodGroup: TBloodGroup[] = [
  "A+",
  "A-",
  "B+",
  "B-",
  "AB+",
  "AB-",
  "O+",
  "O-",
];

export const Designation: TDesignation[] = ["Admin", "Moderator"];

export const AdminSearchableFields = [
  "email",
  "id",
  "contactNo",
  "emergencyContactNo",
  "name.firstName",
  "name.lastName",
  "name.middleName",
];
