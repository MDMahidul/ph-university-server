"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserControllers = void 0;
//import studentValidationSchema from "../student/student.validation";
const user_service_1 = require("./user.service");
const createStudent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { password, student: studentData } = req.body;
        //zod validation check
        //const zodparseData = studentValidationSchema.parse(studentData)
        const result = yield user_service_1.UserServices.createStudentIntoDB(password, studentData);
        res.status(200).json({
            success: true,
            message: "Student created successfully!",
            data: result,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Something went wrong!",
            error: error,
        });
    }
});
exports.UserControllers = { createStudent };
