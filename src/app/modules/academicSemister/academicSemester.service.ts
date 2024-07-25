import httpStatus from "http-status";
import {
  academicSemesterNameCodeMapper,
  AcademicSemesterSearchableFields,
} from "./academicSemester.constant";
import { TAcademicSemester } from "./academicSemester.interface";
import { AcademicSemester } from "./academicSemester.model";
import AppError from "../../errors/AppError";
import QueryBuilder from "../../builder/QueryBuilder";

const createAcademicSemesterIntoDB = async (payload: TAcademicSemester) => {
  // semester name --> semester code
  if (academicSemesterNameCodeMapper[payload.name] !== payload.code) {
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid semester code!");
  }

  const result = await AcademicSemester.create(payload);

  return result;
};

const getAllAcademicSemesterFromDB = async (query: Record<string, unknown>) => {
  const academicSemesterQuery = new QueryBuilder(AcademicSemester.find(), query)
    .search(AcademicSemesterSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await academicSemesterQuery.modelQuery;
  const meta = await academicSemesterQuery.countTotal();

  return {
    result,
    meta,
  };
};

const getSingleAcademicSemesterFrom = async (id: string) => {
  const result = await AcademicSemester.findById(id);

  return result;
};

const updateSingleAcademicSemesterIntoDB = async (
  id: string,
  payload: Partial<TAcademicSemester>
) => {
  //check validation of semester name and code
  if (
    payload.name &&
    payload.code &&
    academicSemesterNameCodeMapper[payload.name] !== payload.code
  ) {
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid semester code!");
  }
  const result = await AcademicSemester.findByIdAndUpdate(
    { _id: id },
    payload,
    { new: true }
  );

  return result;
};

export const AcademicSemesterServices = {
  createAcademicSemesterIntoDB,
  getAllAcademicSemesterFromDB,
  getSingleAcademicSemesterFrom,
  updateSingleAcademicSemesterIntoDB,
};
