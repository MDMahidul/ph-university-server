"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRoutes = void 0;
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("./user.controller");
const validationRequest_1 = __importDefault(require("../../middlewares/validationRequest"));
const student_validation_1 = require("../student/student.validation");
const router = express_1.default.Router();
router.post('/create-student', (0, validationRequest_1.default)(student_validation_1.studentValidations.createStudentValidationSchema), user_controller_1.UserControllers.createStudent);
exports.UserRoutes = router;
