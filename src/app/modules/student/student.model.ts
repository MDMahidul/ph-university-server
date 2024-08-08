import { Schema, model } from "mongoose";
import {
  TGuardian,
  TLocalGuardian,
  TStudent,
  TUserName,
} from "./student.interface";

const userNameSchema = new Schema<TUserName>({
  firstName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 20,
  },
  middleName: { type: String, trim: true },
  lastName: { type: String, required: true, maxlength: 20 },
});

const guardianSchema = new Schema<TGuardian>({
  fatherName: {
    type: String,
    required: true,
    trim: true,
  },
  fatherOccupation: {
    type: String,
    trim: true,
    required: true,
  },
  fatherContactNo: {
    type: String,
    trim: true,
    required: true,
  },
  motherName: {
    type: String,
    trim: true,
    required: true,
  },
  motherOccupation: {
    type: String,
    trim: true,
    required: true,
  },
  motherContactNo: {
    type: String,
    trim: true,
    required: true,
  },
});

const localGuardianSchema = new Schema<TLocalGuardian>({
  name: { type: String, trim: true, required: true },
  occupation: {
    type: String,
    trim: true,
    required: true,
  },
  contactNo: {
    type: String,
    trim: true,
    required: true,
  },
  address: {
    type: String,
    trim: true,
    required: true,
  },
});

//main schema
const studentSchema = new Schema<TStudent>(
  {
    id: { type: String, required: [true, "ID is required"], unique: true },
    user: {
      type: Schema.Types.ObjectId,
      required: [true, "User id is required"],
      unique: true,
      ref: "User",
    },
    name: { type: userNameSchema, required: [true, "User name is required"] },
    gender: {
      type: String,
      enum: {
        values: ["male", "female", "others"],
        message:
          "The gender field can only be one of the following: 'male', 'female', 'others'",
      },
      required: [true, "Gender is required"],
    },
    dateOfBirth: { type: Date },
    email: {
      type: String,
      trim: true,
      required: [true, "email is required"],
      unique: true,
    },
    contactNo: {
      type: String,
      trim: true,
      required: [true, "contact is required"],
    },
    emergencyContactNo: {
      type: String,
      trim: true,
      required: [true, "em contact is required"],
    },
    bloodGroup: {
      type: String,
      enum: ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"],
    },
    presentAddress: {
      type: String,
      trim: true,
      required: [true, "P.Address is required"],
    },
    permanentAddress: {
      type: String,
      trim: true,
      required: [true, "Par.Address is required"],
    },
    guardian: { type: guardianSchema, required: [true, "Gurdian is required"] },
    localGuardian: {
      type: localGuardianSchema,
      required: [true, "LG is required"],
    },
    profileImage: { type: String, default: "" },
    admissionSemester: {
      type: Schema.Types.ObjectId,
      ref: "AcademicSemester",
    },
    academicDepartment: {
      type: Schema.Types.ObjectId,
      ref: "AcademicDepartment",
    },
    academicFaculty: {
      type: Schema.Types.ObjectId,
      ref: "AcademicFaculty",
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    toJSON: {
      virtuals: true,
    },
  }
);

// virtual
studentSchema.virtual("fullName").get(function () {
  return (
    this?.name?.firstName +
    " " +
    this?.name?.middleName +
    " " +
    this?.name?.lastName
  );
});

// create query middleware
studentSchema.pre("find", function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});
studentSchema.pre("findOne", function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

// 3. Create a Model.
export const Student = model<TStudent>("Student", studentSchema);
