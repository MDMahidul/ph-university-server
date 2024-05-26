"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const userNameSchemaValidation = zod_1.z.object({
    firstName: zod_1.z
        .string()
        .nonempty("First name is required")
        .max(20, "First name cannot be more than 20 characters")
        .refine((value) => value.charAt(0).toUpperCase() + value.slice(1) === value, {
        message: "First name must be capitalized",
    }),
    middleName: zod_1.z.string().optional(),
    lastName: zod_1.z.string().nonempty("Last name is required"),
});
const guardianSchemaValidation = zod_1.z.object({
    fatherName: zod_1.z.string().nonempty("Father name is required"),
    fatherOccupation: zod_1.z.string().nonempty("Father occupation is required"),
    fatherContactNo: zod_1.z.string().nonempty("Father contact is required"),
    motherName: zod_1.z.string().nonempty("Mother name is required"),
    motherOccupation: zod_1.z.string().nonempty("Mother occupation is required"),
    motherContactNo: zod_1.z.string().nonempty("Mother contact is required"),
});
const localGuardianSchemaValidation = zod_1.z.object({
    name: zod_1.z.string().nonempty("LG name is required"),
    occupation: zod_1.z.string().nonempty("LG occupation is required"),
    contactNo: zod_1.z.string().nonempty("LG contact is required"),
    address: zod_1.z.string().nonempty("LG address is required"),
});
// Main schema: Student
const studentValidationSchema = zod_1.z.object({
    id: zod_1.z.string(),
    name: userNameSchemaValidation,
    gender: zod_1.z.enum(["male", "female", "others"], {
        errorMap: () => ({
            message: "Gender can only be 'male', 'female', or 'others'",
        }),
    }),
    dateOfBirth: zod_1.z.string().nonempty("DOB is required"),
    email: zod_1.z.string().nonempty("Email is required").email("Invalid email format"),
    contactNo: zod_1.z.string().nonempty("Contact is required"),
    emergencyContactNo: zod_1.z.string().nonempty("Emergency contact is required"),
    bloodGroup: zod_1.z
        .enum(["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"])
        .optional(),
    presentAddress: zod_1.z.string().nonempty("Present address is required"),
    parmanentAddress: zod_1.z.string().nonempty("Permanent address is required"),
    guardian: guardianSchemaValidation,
    localGuardian: localGuardianSchemaValidation,
    profileImage: zod_1.z.string().optional(),
    isActive: zod_1.z.enum(["active", "blocked"]).default("active"),
    isDelete: zod_1.z.boolean(),
});
exports.default = studentValidationSchema;
