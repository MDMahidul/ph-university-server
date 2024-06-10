import { Router } from "express";
import { UserRoutes } from "../modules/user/user.routes";
import { StudentRoutes } from "../modules/student/student.routes";
import { AcademicSemesterRouters } from "../modules/academicSemister/academicSemester.routes";
import { FacultyRouters } from "../modules/faculty/faculty.routes";
import { AdminRouters } from "../modules/admin/admin.routes";
import { CourseRouters } from "../modules/course/course.routes";
import { semesterRegistrationRoutes } from "../modules/semesterRegistration/semesterRegistration.routes";

const router=Router();

const moduleRoutes = [
  {
    path: "/users",
    route: UserRoutes,
  },
  {
    path: "/students",
    route: StudentRoutes,
  },
  {
    path: "/academic-semesters",
    route: AcademicSemesterRouters,
  },
  {
    path: "/faculties",
    route: FacultyRouters,
  },
  {
    path: "/admins",
    route: AdminRouters,
  },
  {
    path: "/courses",
    route: CourseRouters,
  },
  {
    path: "/semester-registrations",
    route: semesterRegistrationRoutes,
  },
];

moduleRoutes.forEach(route=>router.use(route.path,route.route));

export default router;