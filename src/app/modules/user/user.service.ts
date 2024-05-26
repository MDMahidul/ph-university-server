import config from "../../config";
import { TStudent } from "../student/student.interface";
import { Student } from "../student/student.model";
import { TUser } from "./user.interface"
import { User } from "./user.model";


const createStudentIntoDB= async(password:string,studentData:TStudent)=>{
    // create a user object using partial
    const userData:Partial<TUser>={};

    // check if password is given or not, if not use default pass
    userData.password=password || (config.default_password as string);

    // set student role
    userData.role='student';

    // manually generate id
    userData.id='2030100001';

    // create user
    const newUser = await User.create(userData);

    // create new student using new user
    if(Object.keys(newUser).length){
        // set id, _id as user
        studentData.id=newUser.id;
        studentData.user=newUser._id; // reference _id

        const newStudent = await Student.create(studentData);

        return newStudent
    }
}

export const UserServices={
    createStudentIntoDB
}