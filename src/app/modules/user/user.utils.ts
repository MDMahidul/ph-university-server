import { TAcademicSemester } from "../academicSemister/academicSemester.interface";
import { User } from "./user.model"

// find last student id
const findLastStudentId = async()=>{
    const lastStudent = await User.findOne({role:'student'},{id:1,_id:0}).sort({createdAt:-1}).lean();

    return lastStudent?.id ? lastStudent.id: undefined;
}

// generate id
export const generateStudentId = async(payload:TAcademicSemester)=>{
  // first student entry
  let currentId = (0).toString(); // by default 0000

  const lastStudentId = await findLastStudentId(); //get the last student Id
  const lastStudentSemesterCode = lastStudentId?.substring(4, 6);
  const lastStudentYear = lastStudentId?.substring(0, 4);
  // get the current student semester code and year from payload
  const currentSemesterCode = payload.code;
  const currentYear = payload.year;

  if(lastStudentId && lastStudentSemesterCode === currentSemesterCode && lastStudentYear === currentYear){
    currentId = lastStudentId.substring(6);
  }

  let incrementId = (Number(currentId) + 1).toString().padStart(4, "0");

  // create the id
  incrementId = `${payload.year}${payload.code}${incrementId}`;

  return incrementId;
}