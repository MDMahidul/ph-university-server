"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AcademicSemester = void 0;
const mongoose_1 = require("mongoose");
const academicSemester_constant_1 = require("./academicSemester.constant");
const academicSemesterSchema = new mongoose_1.Schema({
    name: { type: String, required: true, enum: academicSemester_constant_1.AcademicSemesterName },
    code: { type: String, required: true, enum: academicSemester_constant_1.AcademicSemesterCode },
    year: { type: String, required: true },
    startMonth: { type: String, required: true, enum: academicSemester_constant_1.Months },
    endMonth: { type: String, required: true, enum: academicSemester_constant_1.Months },
});
exports.AcademicSemester = (0, mongoose_1.model)("AcademicSemester", academicSemesterSchema);
