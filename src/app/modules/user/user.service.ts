import config from "../../config";
import { AcademicSemester } from "../academicSemister/academicSemester.model";
import { TStudent } from "../student/student.interface";
import { Student } from "../student/student.model";
import { TUser } from "./user.interface"
import { User } from "./user.model";
import { generateStudentId } from "./user.utils";


const createStudentIntoDB= async(password:string,payload:TStudent)=>{
    // create a user object using partial
    const userData:Partial<TUser>={};

    // check if password is given or not, if not use default pass
    userData.password=password || (config.default_password as string);

    // set student role
    userData.role='student';

    //find academic semester info
    const admissionSemester = await AcademicSemester.findById(payload.admissionSemester)

    // set generate id
    userData.id=await generateStudentId(admissionSemester);

    // create user
    const newUser = await User.create(userData);

    // create new student using new user
    if(Object.keys(newUser).length){
        // set id, _id as user
        payload.id=newUser.id;
        payload.user=newUser._id; // reference _id

        const newStudent = await Student.create(payload);

        return newStudent
    }
}

export const UserServices={
    createStudentIntoDB
}