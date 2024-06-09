import { Schema, Types, model } from "mongoose";
import {
  TCourse,
  TCourseFaculty,
  TPreRequisitCourses,
} from "./course.interface";

const preRequisiteCoursesSchema = new Schema<TPreRequisitCourses>({
  course: {
    type: Schema.Types.ObjectId,
    ref: "Course",
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
});

const courseSchema = new Schema<TCourse>({
  title: {
    type: String,
    unique: true,
    trim: true,
    required: [true, "Course title is required"],
  },
  prefix: {
    type: String,
    trim: true,
    required: [true, "Course prefix is required"],
  },
  code: {
    type: Number,
    trim: true,
    required: [true, "Course Code is required"],
  },
  credits: {
    type: Number,
    trim: true,
    required: [true, "Course credit is required"],
  },
  preRequisiteCourses: [preRequisiteCoursesSchema],
  isDeleted: {
    type: Boolean,
    default: false,
  },
});

export const Course = model<TCourse>("Course", courseSchema);

const coureseFacultySchema = new Schema<TCourseFaculty>({
  course: {
    type: Schema.Types.ObjectId,
    unique: true,
    ref: "Course",
  },
  faculties: [
    {
      type: Schema.Types.ObjectId,
      ref: "Faculty",
    },
  ],
});

export const CourseFaculty = model<TCourseFaculty>(
  "CourseFaculty",
  coureseFacultySchema
);
