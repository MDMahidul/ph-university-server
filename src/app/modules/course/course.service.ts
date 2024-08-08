import httpStatus from 'http-status';
import QueryBuilder from '../../builder/QueryBuilder';
import { CourseSearchableFields } from './course.constant';
import { TCourse, TCourseFaculty } from './course.interface';
import { Course, CourseFaculty } from './course.model';
import AppError from '../../errors/AppError';
import mongoose from 'mongoose';

const createCourseIntoDB = async (payload: TCourse) => {
  const result = await Course.create(payload);

  return result;
};

const getAllCoursesFromDB = async (query: Record<string, unknown>) => {
  const courseQuery = new QueryBuilder(
    Course.find().populate('preRequisiteCourses.course'),
    query,
  )
    .search(CourseSearchableFields)
    .sort()
    .filter()
    .fields()
    .paginate();

  const result = await courseQuery.modelQuery;
  const meta = await courseQuery.countTotal();

  return {
    meta,
    result,
  };
};

const getSingleCourseFromDB = async (id: string) => {
  const result = await Course.findById(id).populate(
    'preRequisiteCourses.course',
  );

  return result;
};

const deleteCourseFromDB = async (id: string) => {
  const result = await Course.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true },
  );

  return result;
};

const updateCourseIntoDB = async (id: string, payload: Partial<TCourse>) => {
  const { preRequisiteCourses, ...courseRemainingData } = payload;

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    // step1: basic couse info update
    const updateBasicCourseInfo = await Course.findByIdAndUpdate(
      id,
      courseRemainingData,
      {
        new: true,
        runValidators: true,
        session,
      }
    );

    if (!updateBasicCourseInfo) {
      throw new AppError(httpStatus.BAD_REQUEST, "Faild to update course!");
    }

    // check if there is any prerequisite courese to update
    if (preRequisiteCourses && preRequisiteCourses.length > 0) {
      // filter out the deleted fields
      const deletedPreRequisites = preRequisiteCourses
        .filter((el) => el.course && el.isDeleted)
        .map((el) => el.course);

      const deleteDPreRequisitesCourses = await Course.findByIdAndUpdate(
        id,
        {
          $pull: {
            preRequisiteCourses: { course: { $in: deletedPreRequisites } },
          },
        },
        {
          new: true,
          runValidators: true,
          session,
        }
      );

      if (!deleteDPreRequisitesCourses) {
        throw new AppError(httpStatus.BAD_REQUEST, "Faild to update course!");
      }

      // filter out the new course fields
      const newPreRequisits = preRequisiteCourses?.filter(
        (el) => el.course && !el.isDeleted
      );

      const newPreRequisitsCourses = await Course.findByIdAndUpdate(
        id,
        {
          $addToSet: { preRequisiteCourses: { $each: newPreRequisits } },
        },
        {
          new: true,
          runValidators: true,
          session,
        }
      );

      if (!newPreRequisitsCourses) {
        throw new AppError(httpStatus.BAD_REQUEST, "Faild to update course1");
      }
    }

    await session.commitTransaction();
    await session.endSession();

    const result = await Course.findById(id).populate(
      "preRequisiteCourses.course"
    );

    return result;
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();

    throw new AppError(httpStatus.BAD_REQUEST, "Faild to update course1");
  }
};

const assignFacultiesWithCourseIntoDB = async (
  id: string,
  payload: Partial<TCourseFaculty>
) => {
  const result = await CourseFaculty.findByIdAndUpdate(
    id,
    { course: id, $addToSet: { faculties: { $each: payload } } },
    { upsert: true, new: true }
  );

  return result;
};


const getFacultiesWithCourseFromDB = async (courseId:string) => {
  const result = await CourseFaculty.findOne({course:courseId}).populate('faculties');

  return result;
};


const removeFacultiesFromCourseFromDB = async (
  id: string,
  payload: Partial<TCourseFaculty>
) => {
  const result = await CourseFaculty.findByIdAndUpdate(id, {
    $pull: { faculties: { $in: payload } },
  });

  return result;
};

export const CourseServices = {
  createCourseIntoDB,
  getAllCoursesFromDB,
  getSingleCourseFromDB,
  deleteCourseFromDB,
  updateCourseIntoDB,
  assignFacultiesWithCourseIntoDB,
  removeFacultiesFromCourseFromDB,
  getFacultiesWithCourseFromDB,
};
