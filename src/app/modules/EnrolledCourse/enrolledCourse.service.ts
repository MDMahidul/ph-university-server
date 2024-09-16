/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { OfferedCourse } from "../OfferedCourse/offeredCourse.model";
import { TEnrolledCourse } from "./enrolledCourse.interface";
import EnrolledCourse from "./enrolledCourse.model";
import { Student } from "../Student/student.model";
import { SemesterRegistration } from "../SemesterRegistration/semesterRegistration.model";
import { Course } from "../Course/course.model";
import mongoose from "mongoose";
import { Faculty } from "../Faculty/faculty.model";
import { calculateGradeAndPoints } from "./enrolledCourse.utils";
import QueryBuilder from "../../builder/QueryBuilder";

const createEnrolledCourseIntoDB = async (
  userId: string,
  payload: TEnrolledCourse
) => {
  /* check if the offeredCourse is exists */
  const { offeredCourse } = payload;

  const isOffredCourseExists = await OfferedCourse.findById(offeredCourse);

  if (!isOffredCourseExists) {
    throw new AppError(httpStatus.NOT_FOUND, "Offered course not found!");
  }

  /* check max capacity  */
  if (isOffredCourseExists.maxCapacity <= 0) {
    throw new AppError(httpStatus.BAD_REQUEST, "Room is full!");
  }

  /* get student id */
  const student = await Student.findOne(
    {
      id: userId,
    },
    { _id: 1 }
  );

  if (!student) {
    throw new AppError(httpStatus.NOT_FOUND, "Student not found!");
  }

  /* check if the student is already enrolled */
  const isStudentAlreadyEnrolled = await EnrolledCourse.findOne({
    semesterRegistration: isOffredCourseExists?.semesterRegistration,
    offeredCourse,
    student: student._id,
  });

  if (isStudentAlreadyEnrolled) {
    throw new AppError(httpStatus.CONFLICT, "Student is already enrolled!");
  }

  /* get the course data */
  const course = await Course.findById(isOffredCourseExists.course);
  const currentCredit = course?.credits;

  /* check credit capacity */
  const semesterRegistration = await SemesterRegistration.findById(
    isOffredCourseExists?.semesterRegistration
  ).select("maxCredit");

  const maxCredit = semesterRegistration?.maxCredit;

  const enrolledCourses = await EnrolledCourse.aggregate([
    /* stage 1  get the student*/
    {
      $match: {
        semesterRegistration: isOffredCourseExists.semesterRegistration,
        student: student._id,
      },
    },
    /* stage 2 get the course credit*/
    {
      $lookup: {
        from: "courses",
        localField: "course",
        foreignField: "_id",
        as: "enrolledCourseData",
      },
    },
    /* stage 3 unwind the course data */
    {
      $unwind: "$enrolledCourseData",
    },
    {
      $group: {
        _id: null,
        totalEnrolledCredits: { $sum: "$enrolledCourseData.credits" },
      },
    },
    {
      $project: {
        _id: 0,
        totalEnrolledCredits: 1,
      },
    },
  ]);

  /* total enrolled credits + new enrolled course credit > max credit */
  const totalCredits =
    enrolledCourses.length > 0 ? enrolledCourses[0].totalEnrolledCredits : 0;

  if (totalCredits && maxCredit && totalCredits + currentCredit > maxCredit) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "You have exceeded maximum number of credits!"
    );
  }

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const result = await EnrolledCourse.create(
      [
        {
          semesterRegistration: isOffredCourseExists.semesterRegistration,
          academicSemester: isOffredCourseExists.academicSemester,
          academicFaculty: isOffredCourseExists.academicFaculty,
          academicDepartment: isOffredCourseExists.academicDepartment,
          offeredCourse: offeredCourse,
          course: isOffredCourseExists.course,
          student: student._id,
          isEnrolled: true,
          faculty: isOffredCourseExists.faculty,
        },
      ],
      { session }
    );
    if (!result) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "Failed to endroll in this course!"
      );
    }

    const maxCapacity = isOffredCourseExists.maxCapacity;
    await OfferedCourse.findByIdAndUpdate(offeredCourse, {
      maxCapacity: maxCapacity - 1,
    });

    await session.commitTransaction();
    await session.endSession();

    return result;
  } catch (err: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(err);
  }
};

const updateEnrolledCourseIntoDB = async (
  facultyId: string,
  payload: Partial<TEnrolledCourse>
) => {
  const { semesterRegistration, offeredCourse, student, courseMarks } = payload;

  const isSemesterRegistrationExists =
    await SemesterRegistration.findById(semesterRegistration);

  if (!isSemesterRegistrationExists) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "Semester Registration not found!"
    );
  }

  const isOffredCourseExists = await OfferedCourse.findById(offeredCourse);

  if (!isOffredCourseExists) {
    throw new AppError(httpStatus.NOT_FOUND, "Offered course not found!");
  }

  const isStudentExists = await Student.findById(student);

  if (!isStudentExists) {
    throw new AppError(httpStatus.NOT_FOUND, "Student not found!");
  }

  const faculty = await Faculty.findOne({ id: facultyId }, { _id: 1 });

  if (!faculty) {
    throw new AppError(httpStatus.NOT_FOUND, "Faculty not found!");
  }

  const isCourseBelongsToFaculty = await EnrolledCourse.findOne({
    semesterRegistration,
    offeredCourse,
    student,
    faculty: faculty._id,
  });

  if (!isCourseBelongsToFaculty) {
    throw new AppError(httpStatus.FORBIDDEN, "Your are not authorized!");
  }

  /* update course marks dynamically */
  const modifiedData: Record<string, unknown> = { ...courseMarks };

  if (courseMarks?.finalTerm) {
    const { classTest1, classTest2, midTerm, finalTerm } =courseMarks;

    const totalMarks =
      Math.ceil(classTest1) +
      Math.ceil(midTerm) +
      Math.ceil(classTest2) +
      Math.ceil(finalTerm);

    const result = calculateGradeAndPoints(totalMarks);
    modifiedData.grade = result.grade;
    modifiedData.gradePoints = result.gradePoints;
    modifiedData.isCompleted = true;
  }

  if (courseMarks && Object.keys(courseMarks).length) {
    for (const [key, value] of Object.entries(courseMarks)) {
      modifiedData[`courseMarks.${key}`] = value;
    }
  }
  const result = await EnrolledCourse.findByIdAndUpdate(
    isCourseBelongsToFaculty._id,
    modifiedData,
    {
      new: true,
    }
  );

  return result;
};

const getAllEnrolledCourseFromDB = async (query: Record<string, unknown>) => {
  const enrolledCourseQuery = new QueryBuilder(
    EnrolledCourse.find()
      .populate("academicSemester")
      .populate("course")
      .populate("semesterRegistration")
      .populate("student")
      .populate("faculty"),
    query
  )
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await enrolledCourseQuery.modelQuery;
  const meta = await enrolledCourseQuery.countTotal();

  return {
    meta,
    result,
  };
};

const getMyEnrolledCoursesFromDB = async (
  studentId: string,
  query: Record<string, unknown>
) => {
  //console.log(studentId);
  const student = await Student.findOne({ id: studentId });

  if (!student) {
    throw new AppError(httpStatus.NOT_FOUND, "Student not found !");
  }

  const enrolledCourseQuery = new QueryBuilder(
    EnrolledCourse.find({ student: student._id }).populate(
      "semesterRegistration academicSemester academicFaculty academicDepartment offeredCourse course student faculty"
    ),
    query
  )
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await enrolledCourseQuery.modelQuery;
  const meta = await enrolledCourseQuery.countTotal();

  return {
    meta,
    result,
  };
};

export const EnrolledCourseServices = {
  createEnrolledCourseIntoDB,
  updateEnrolledCourseIntoDB,
  getAllEnrolledCourseFromDB,
  getMyEnrolledCoursesFromDB,
};
