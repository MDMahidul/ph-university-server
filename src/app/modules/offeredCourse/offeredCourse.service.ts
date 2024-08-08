import httpStatus from "http-status";
import { SemesterRegistration } from "../SemesterRegistration/semesterRegistration.model";
import { TOfferedCourse } from "./offeredCourse.interface";
import { OfferedCourse } from "./offeredCourse.model";
import { AcademicFaculty } from "../AcademicFaculty/academicFaculty.model";
import { AcademicDepartment } from "../AcademicDepartment/academicDepartment.model";
import { Course } from "../Course/course.model";
import { Faculty } from "../Faculty/faculty.model";
import AppError from "../../errors/AppError";
import { hasTimeConflict } from "./offeredCourse.utlis";
import QueryBuilder from "../../builder/QueryBuilder";
import { Student } from "../Student/student.model";

const getAllOfferedCoursesFromDB = async (query: Record<string, unknown>) => {
  const offeredCourseQuery = new QueryBuilder(OfferedCourse.find(), query)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await offeredCourseQuery.modelQuery;
  const meta = await offeredCourseQuery.countTotal();

  return {
    meta,
    result,
  };
};

const getMyOfferedCoursesFromDB = async (
  userId: string,
  query: Record<string, unknown>
) => {
  /* custom pagination */
  const page = Number(query?.page) || 1;
  const limit = Number(query?.limit) || 10;
  const skip = (page - 1) * limit;

  const student = await Student.findOne({ id: userId });

  if (!student) {
    throw new AppError(httpStatus.NOT_FOUND, "Student not found!");
  }

  /* find current ongoing semester */
  const currentOngoingRegestrationSemester = await SemesterRegistration.findOne(
    { status: "ONGOING" }
  );

  if (!currentOngoingRegestrationSemester) {
    throw new AppError(httpStatus.NOT_FOUND, "No onging semester found!");
  }

  const aggregationQuery = [
    {
      /* match semester */
      $match: {
        semesterRegistration: currentOngoingRegestrationSemester?._id,
        academicFaculty: student?.academicFaculty,
        academicDepartment: student.academicDepartment,
      },
    },
    {
      $lookup: {
        from: "courses",
        localField: "course",
        foreignField: "_id",
        as: "course",
      },
    },
    {
      $unwind: "$course",
    },
    {
      $lookup: {
        from: "enrolledcourses",
        let: {
          currentOngoingRegestrationSemester:
            currentOngoingRegestrationSemester._id,
          currentStudent: student._id,
        },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  {
                    $eq: [
                      "$semesterRegistration",
                      "$$currentOngoingRegestrationSemester",
                    ],
                  },
                  {
                    $eq: ["$student", "$$currentStudent"],
                  },
                  {
                    $eq: ["$isEnrolled", true],
                  },
                ],
              },
            },
          },
        ],
        as: "enrolledCourses",
      },
    },
    {
      $lookup: {
        from: "enrolledcourses",
        let: {
          currentStudent: student._id,
        },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  {
                    $eq: ["$student", "$$currentStudent"],
                  },
                  { $eq: ["$isCompleted", true] },
                ],
              },
            },
          },
        ],
        as: "completedCourses",
      },
    },
    {
      $addFields: {
        completedCourseIds: {
          $map: {
            input: "$completedCourses",
            as: "completed",
            in: "$$completed.course",
          },
        },
      },
    },
    {
      $addFields: {
        isPreRequisitesFulFilled: {
          $or: [
            { $eq: ["$course.preRequisiteCourses", []] },
            {
              $setIsSubset: [
                "$course.preRequisiteCourses.course",
                "$completedCourseIds",
              ],
            },
          ],
        },
        isAlreadyEnrolled: {
          $in: [
            "$course._id",
            {
              $map: {
                input: "$enrolledCourses",
                as: "enroll",
                in: "$$enroll.course",
              },
            },
          ],
        },
      },
    },
    {
      $match: {
        isAlreadyEnrolled: false,
        isPreRequisitesFulFilled: true,
      },
    },
  ];

  const paginationQuery = [
    {
      $skip: skip,
    },
    {
      $limit: limit,
    },
  ];

  const result = await OfferedCourse.aggregate([...aggregationQuery,...paginationQuery]);

  const total = (await OfferedCourse.aggregate(aggregationQuery)).length;
  const totalPage = Math.ceil(total / limit);

  return { meta: { page, limit, total, totalPage }, result };
};

const getSingleOfferedCourseFromDB = async (id: string) => {
  const offeredCourse = await OfferedCourse.findById(id);

  if (!offeredCourse) {
    throw new AppError(httpStatus.NOT_FOUND, "Offered Course not found");
  }

  return offeredCourse;
};

const createOfferedCourseIntoDB = async (payload: TOfferedCourse) => {
  //check if the semester registration id exists
  const {
    semesterRegistration,
    academicFaculty,
    academicDepartment,
    course,
    faculty,
    section,
    days,
    startTime,
    endTime,
  } = payload;

  const isSemesterRegistrationExists =
    await SemesterRegistration.findById(semesterRegistration);

  if (!isSemesterRegistrationExists) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "Semester registration not found!"
    );
  }

  const academicSemester = isSemesterRegistrationExists.academicSemester;

  const isAcademicFacultyExists =
    await AcademicFaculty.findById(academicFaculty);

  if (!isAcademicFacultyExists) {
    throw new AppError(httpStatus.NOT_FOUND, "Academic Faculty not found!");
  }

  const isAcademicDepartmentExists =
    await AcademicDepartment.findById(academicDepartment);

  if (!isAcademicDepartmentExists) {
    throw new AppError(httpStatus.NOT_FOUND, "Academic Department not found!");
  }

  const isCourseExists = await Course.findById(course);

  if (!isCourseExists) {
    throw new AppError(httpStatus.NOT_FOUND, "Course not found!");
  }

  const isFacultyExists = await Faculty.findById(faculty);

  if (!isFacultyExists) {
    throw new AppError(httpStatus.NOT_FOUND, "Faculty not found!");
  }

  //check if the department is belog to the faculty
  const isDepartmentBelongToFaculty = await AcademicDepartment.findOne({
    _id: academicDepartment,
    academicFaculty,
  });

  if (!isDepartmentBelongToFaculty) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      `This ${isAcademicDepartmentExists.name} is not belog to this ${isAcademicFacultyExists.name}`
    );
  }

  // check if the same offered course same section in same registered semester exists
  const isSameOfferedCourseExistsWithSameRegisteredSemesterWithSameSection =
    await OfferedCourse.findOne({
      semesterRegistration,
      course,
      section,
    });

  if (isSameOfferedCourseExistsWithSameRegisteredSemesterWithSameSection) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      `Offered course with same section is already exists!`
    );
  }

  // get the schedules of the faculties
  const assignedSchedules = await OfferedCourse.find({
    semesterRegistration,
    faculty,
    days: { $in: days },
  }).select("days startTime endTime");

  console.log(assignedSchedules);

  const newSchedule = {
    days,
    startTime,
    endTime,
  };

  if (hasTimeConflict(assignedSchedules, newSchedule)) {
    throw new AppError(
      httpStatus.CONFLICT,
      `This faculty is not available at that time, Choose other time or day!`
    );
  }

  const result = await OfferedCourse.create({ ...payload, academicSemester });

  return result;
};

const updateOfferedCourseIntoDB = async (
  id: string,
  payload: Pick<TOfferedCourse, "faculty" | "days" | "startTime" | "endTime">
) => {
  const { faculty, days, startTime, endTime } = payload;

  const isOfferedCouresExists = await OfferedCourse.findById(id);

  if (!isOfferedCouresExists) {
    throw new AppError(httpStatus.NOT_FOUND, "Offered Course not found!");
  }

  const isFacultyExists = await Faculty.findById(faculty);

  if (!isFacultyExists) {
    throw new AppError(httpStatus.NOT_FOUND, "Faculty not found!");
  }

  const semesterRegistration = isOfferedCouresExists.semesterRegistration;

  const semesterRegistrationStatus =
    await SemesterRegistration.findById(semesterRegistration);

  if (semesterRegistrationStatus?.status !== "UPCOMING") {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `You can not update this offered course as it is ${semesterRegistrationStatus?.status}`
    );
  }
  // get the schedules of the faculties
  const assignedSchedules = await OfferedCourse.find({
    semesterRegistration,
    faculty,
    days: { $in: days },
  }).select("days startTime endTime");

  const newSchedule = {
    days,
    startTime,
    endTime,
  };

  if (hasTimeConflict(assignedSchedules, newSchedule)) {
    throw new AppError(
      httpStatus.CONFLICT,
      `This faculty is not available at that time, Choose other time or day!`
    );
  }

  const result = await OfferedCourse.findByIdAndUpdate(id, payload, {
    new: true,
  });
};

const deleteOfferedCourseFromDB = async (id: string) => {
  // check if offered course exists
  const isOfferedCourseExists = await OfferedCourse.findById(id);

  if (!isOfferedCourseExists) {
    throw new AppError(httpStatus.NOT_FOUND, "Offered Course not found");
  }

  // check if the semester registration status is upcoming
  const semesterRegistration = isOfferedCourseExists.semesterRegistration;

  const semesterRegistrationStatus =
    await SemesterRegistration.findById(semesterRegistration).select("status");

  if (semesterRegistrationStatus?.status !== "UPCOMING") {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `Offered course can not update ! because the semester ${semesterRegistrationStatus}`
    );
  }

  const result = await OfferedCourse.findByIdAndDelete(id);

  return result;
};

export const OfferedCourseServices = {
  createOfferedCourseIntoDB,
  updateOfferedCourseIntoDB,
  getAllOfferedCoursesFromDB,
  getSingleOfferedCourseFromDB,
  deleteOfferedCourseFromDB,
  getMyOfferedCoursesFromDB,
};
