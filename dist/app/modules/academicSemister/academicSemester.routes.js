"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AcademicSemesterRouters = void 0;
const express_1 = __importDefault(require("express"));
const validationRequest_1 = __importDefault(require("../../middlewares/validationRequest"));
const academicSemester_validation_1 = require("./academicSemester.validation");
const academicSemester_controller_1 = require("./academicSemester.controller");
const router = express_1.default.Router();
router.post('/create-academic-semester', (0, validationRequest_1.default)(academicSemester_validation_1.AcademicSemesterValidations.createAcademicSemesterSchemaValidation), academicSemester_controller_1.AcademicSemesterControllers.createAcademicSemester);
exports.AcademicSemesterRouters = router;
