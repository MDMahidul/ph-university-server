import { TAcademicSemester } from "../AcademicSemester/academicSemester.interface";
import { User } from "./user.model";

// find last student id
const findLastStudentId = async (year: string, semesterCode: string) => {
  const lastStudent = await User.findOne(
    {
      role: "student",
      id: { $regex: `^${year}${semesterCode}` },
    },
    { id: 1, _id: 0 }
  )
    .sort({ createdAt: -1 })
    .lean();

  return lastStudent?.id ? lastStudent.id : undefined;
};

// generate id
export const generateStudentId = async (payload: TAcademicSemester) => {
  // first student entry
  const currentSemesterCode = payload.code;
  const currentYear = payload.year;
  let currentId = (0).toString(); // by default 0000

  const lastStudentId = await findLastStudentId(
    currentYear,
    currentSemesterCode
  ); //get the last student Id

  const lastStudentSemesterCode = lastStudentId?.substring(4, 6);
  const lastStudentYear = lastStudentId?.substring(0, 4);
  // get the current student semester code and year from payload
  /*  const currentSemesterCode = payload.code;
  const currentYear = payload.year; */

  if (
    lastStudentId &&
    lastStudentSemesterCode === currentSemesterCode &&
    lastStudentYear === currentYear
  ) {
    currentId = lastStudentId.substring(6);
  }

  let incrementId = (Number(currentId) + 1).toString().padStart(4, "0");

  // create the id
  incrementId = `${payload.year}${payload.code}${incrementId}`;

  //console.log(`Generated student ID: ${incrementId}`); // Logging the generated ID

  return incrementId;
};

// faculty ID
const findLastFacultyId = async () => {
  const lastFaculty = await User.findOne(
    { role: "faculty" },
    { id: 1, _id: -1 }
  )
    .sort({ createdAt: -1 })
    .lean();

  // If lastFaculty exists and has an id, return the substring of the id starting from the 2nd character.
  // If it doesn't exist, return undefined.
  return lastFaculty?.id ? lastFaculty.id.substring(2) : undefined;
};

// generate new faculty id auto
export const generateFacultyId = async () => {
  // Initialize currentId to "0" by default.
  let currentId = (0).toString();
  // Find the last faculty ID using the function defined above.
  const lastFacultyId = await findLastFacultyId();

  if (lastFacultyId) {
    currentId = lastFacultyId;
  }
  // Increment the currentId by 1 and pad it with leading zeros to ensure it is 4 digits long.
  let incrementId = (Number(currentId) + 1).toString().padStart(4, "0");

  incrementId = `F-${incrementId}`;

  return incrementId;
};

// Admin ID
export const findLastAdminId = async () => {
  const lastAdmin = await User.findOne({ role: "admin" }, { id: 1, _id: 0 })
    .sort({ createdAt: -1 })
    .lean();

  return lastAdmin?.id ? lastAdmin.id.substring(2) : undefined;
};

export const generateAdminId = async () => {
  let currentId = (0).toString();
  const lastAdminId = await findLastAdminId();

  if (lastAdminId) {
    currentId = lastAdminId.substring(2);
  }

  let incrementId = (Number(currentId) + 1).toString().padStart(4, "0");

  incrementId = `A-${incrementId}`;
  return incrementId;
};
