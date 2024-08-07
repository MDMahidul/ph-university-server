import { Router } from "express";
import { UserRoutes } from "../modules/User/user.routes";
import { StudentRoutes } from "../modules/Student/student.routes";
import { AcademicSemesterRouters } from "../modules/AcademicSemester/academicSemester.routes";
import { FacultyRouters } from "../modules/Faculty/faculty.routes";
import { AdminRouters } from "../modules/Admin/admin.routes";
import { CourseRouters } from "../modules/Course/course.routes";
import { semesterRegistrationRoutes } from "../modules/SemesterRegistration/semesterRegistration.routes";
import { OfferedCourseRoutes } from "../modules/OfferedCourse/offeredCourse.routes";
import { AuthRoutes } from "../modules/Auth/auth.routes";
import { AcademicDepartmentRouters } from "../modules/AcademicDepartment/academicDepartment.routes";
import { AcademicFacultyRouters } from "../modules/AcademicFaculty/academicFaculty.routes";
import { EnrolledCourseRoutes } from "../modules/EnrolledCourse/enrolledCourse.routes";

const router = Router();

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
    path: "/academic-departments",
    route: AcademicDepartmentRouters,
  },
  {
    path: "/academic-faculties",
    route: AcademicFacultyRouters,
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
  {
    path: "/offered-courses",
    route: OfferedCourseRoutes,
  },
  {
    path: "/auth",
    route: AuthRoutes,
  },
  {
    path: "/enrolled-courses",
    route: EnrolledCourseRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
