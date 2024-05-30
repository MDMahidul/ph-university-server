import { TAcademicSemester } from "../academicSemister/academicSemester.interface";
import { User } from "./user.model"

// find last student id
const findLastStudentId = async()=>{
    const lastStudent = await User.findOne({role:'student'},{id:1,_id:0}).sort({createdAt:-1}).lean();

    return lastStudent?.id ? lastStudent.id.substring(6) : undefined;
}

// generate id
export const generateStudentId = async(payload:TAcademicSemester)=>{
    // first student entry
    const currentId = await findLastStudentId() || (0).toString();

    let incrementId = (Number(currentId) + 1).toString().padStart(4,'0');

    // create the id
    incrementId = `${payload.year}${payload.code}${incrementId}`;

    return incrementId;
}