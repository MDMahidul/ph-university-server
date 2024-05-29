import { Router } from "express";
import { UserRoutes } from "../modules/user/user.routes";
import { StudentRoutes } from "../modules/student/student.routes";
import { AcademicSemesterRouters } from "../modules/academicSemister/academicSemester.routes";

const router=Router();

const moduleRoutes=[
    {
        path:'/users',
        route:UserRoutes
    },
    {
        path:'/students',
        route:StudentRoutes
    },
    {
        path:'/academic-semesters',
        route:AcademicSemesterRouters
    }
];

moduleRoutes.forEach(route=>router.use(route.path,route.route));

export default router;