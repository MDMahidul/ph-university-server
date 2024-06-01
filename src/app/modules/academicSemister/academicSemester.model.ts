import { Schema, model } from "mongoose";
import { TAcademicSemester } from "./academicSemester.interface";
import {
  AcademicSemesterCode,
  AcademicSemesterName,
  Months,
} from "./academicSemester.constant";
import AppError from "../../errors/Apperror";
import httpStatus from "http-status";

const academicSemesterSchema = new Schema<TAcademicSemester>({
  name: { type: String, required: true, enum: AcademicSemesterName },
  code: { type: String, required: true, enum: AcademicSemesterCode },
  year: { type: String, required: true },
  startMonth: { type: String, required: true, enum: Months },
  endMonth: { type: String, required: true, enum: Months },
});

academicSemesterSchema.pre("save", async function name(next) {
  const isSemesterExists = await AcademicSemester.findOne({
    year: this.year,
    name: this.name,
  });
  if (isSemesterExists) {
    throw new AppError(httpStatus.CONFLICT,"Semester is already exists!");
  }
  next();
});

export const AcademicSemester = model<TAcademicSemester>(
  "AcademicSemester",
  academicSemesterSchema
);
