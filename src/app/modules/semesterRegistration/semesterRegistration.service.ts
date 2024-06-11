import httpStatus from 'http-status';
import { TSemesterRegistration } from './semesterRegistration.interface';
import { SemesterRegistration } from './semesterRegistration.model';
import QueryBuilder from '../../builder/QueryBuilder';
import { AcademicSemester } from '../academicSemister/academicSemester.model';
import AppError from '../../errors/Apperror';
import { RegistrationStatus } from './semesterRegistration.constant';

const createSemesterRegistrationIntoDB = async (
  payload: TSemesterRegistration,
) => {
  const academicSemester = payload?.academicSemester;

  // check if there any registered semseter that is already "UMCOMING" or "ONGOING"
  const ifThereAreAnyUpcomingOrOngoingSemester = await SemesterRegistration.findOne({
    $or:[
      {status: RegistrationStatus.UPCOMING},
      {status: RegistrationStatus.ONGOING},
    ]
  })
  if(ifThereAreAnyUpcomingOrOngoingSemester){
    throw new AppError(httpStatus.BAD_REQUEST,`There is already a ${ifThereAreAnyUpcomingOrOngoingSemester.status} semester`)
  }

  // check if semseter  exists
  const isAcademicSemesterExists =
    await AcademicSemester.findById(academicSemester);
  if (!isAcademicSemesterExists) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "This academic semester not found!"
    );
  }

  // check if the semseter  already registered
  const isSemesterRegistrationExists = await SemesterRegistration.findOne({
    academicSemester,
  });
  if (isSemesterRegistrationExists) {
    throw new AppError(
      httpStatus.CONFLICT,
      "This semester is already registered!"
    );
  }

  const result = await SemesterRegistration.create(payload);

  return result;
};

const getAllSemesterRegistrationsFromDB = async (
  query: Record<string, unknown>,
) => {
  const semesterRegistrationQuery = new QueryBuilder(
    SemesterRegistration.find().populate('academicSemester'),
    query,
  )
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await semesterRegistrationQuery.modelQuery;

  return result;
};

const getSingleSemesterRegistrationsFromDB = async (id: string) => {
  const result = await SemesterRegistration.findById(id);
  
  return result;
};

const updateSemesterRegistrationIntoDB = async (
  id: string,
  payload: Partial<TSemesterRegistration>,
) => {
  // check if the semester registration exists
  const isSemesterRegistrationExists = await SemesterRegistration.findById(id);

  if (!isSemesterRegistrationExists) {
    throw new AppError(httpStatus.NOT_FOUND, "This semester is not found");
  }

  // check if the semester registration is ENDED, then we'll not update that
  const currentSemesterStatus = isSemesterRegistrationExists.status;
  const requestedStatus = payload.status;

  if(currentSemesterStatus === RegistrationStatus.ENDED)
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `This semester is already ${currentSemesterStatus}`
    );

    // status sequence can be only updated upcoming-> ongoing->ended
    if(currentSemesterStatus === RegistrationStatus.UPCOMING && requestedStatus === RegistrationStatus.ENDED){
       throw new AppError(
         httpStatus.BAD_REQUEST,
         `You can not directly change status from ${currentSemesterStatus} to ${requestedStatus}`
       );
    }

    if(currentSemesterStatus === RegistrationStatus.ONGOING && requestedStatus === RegistrationStatus.UPCOMING){
       throw new AppError(
         httpStatus.BAD_REQUEST,
         `You can not directly change status from ${currentSemesterStatus} to ${requestedStatus}`
       );
    }

    // update data
     const result = await SemesterRegistration.findByIdAndUpdate(id, payload, {
       new: true,
       runValidators: true,
     });

     return result;
};

const deleteSemesterRegistrationFromDB = async (id: string) => {};

export const SemesterRegistrationService = {
  createSemesterRegistrationIntoDB,
  getAllSemesterRegistrationsFromDB,
  getSingleSemesterRegistrationsFromDB,
  updateSemesterRegistrationIntoDB,
  deleteSemesterRegistrationFromDB,
};
