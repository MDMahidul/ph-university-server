"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_routes_1 = require("../modules/user/user.routes");
const student_routes_1 = require("../modules/student/student.routes");
const academicSemester_routes_1 = require("../modules/academicSemister/academicSemester.routes");
const router = (0, express_1.Router)();
const moduleRoutes = [
    {
        path: '/users',
        route: user_routes_1.UserRoutes
    },
    {
        path: '/students',
        route: student_routes_1.StudentRoutes
    },
    {
        path: '/academic-semesters',
        route: academicSemester_routes_1.AcademicSemesterRouters
    }
];
moduleRoutes.forEach(route => router.use(route.path, route.route));
exports.default = router;
