import { Schema, model } from 'mongoose';
import { TAcademicFaculty } from './academicFaculty.interface';

const academicFacultySchema = new Schema(
  {
    name: { type: String, unique: true, required: true },
  },
  { timestamps: true },
);

export const AcademicFaculty = model<TAcademicFaculty>('AcademicFaculty',academicFacultySchema)