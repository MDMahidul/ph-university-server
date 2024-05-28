"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.studentValidations = void 0;
const zod_1 = require("zod");
const userNameValidationSchema = zod_1.z.object({
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
const guardianValidationSchema = zod_1.z.object({
    fatherName: zod_1.z.string().nonempty("Father name is required"),
    fatherOccupation: zod_1.z.string().nonempty("Father occupation is required"),
    fatherContactNo: zod_1.z.string().nonempty("Father contact is required"),
    motherName: zod_1.z.string().nonempty("Mother name is required"),
    motherOccupation: zod_1.z.string().nonempty("Mother occupation is required"),
    motherContactNo: zod_1.z.string().nonempty("Mother contact is required"),
});
const localGuardianValidationSchema = zod_1.z.object({
    name: zod_1.z.string().nonempty("LG name is required"),
    occupation: zod_1.z.string().nonempty("LG occupation is required"),
    contactNo: zod_1.z.string().nonempty("LG contact is required"),
    address: zod_1.z.string().nonempty("LG address is required"),
});
// Main schema: Student
const createStudentValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        password: zod_1.z.string().max(20),
        student: zod_1.z.object({
            name: userNameValidationSchema,
            gender: zod_1.z.enum(["male", "female", "others"], {
                errorMap: () => ({
                    message: "Gender can only be 'male', 'female', or 'others'",
                }),
            }),
            dateOfBirth: zod_1.z.string().nonempty("DOB is required"),
            email: zod_1.z
                .string()
                .nonempty("Email is required")
                .email("Invalid email format"),
            contactNo: zod_1.z.string().nonempty("Contact is required"),
            emergencyContactNo: zod_1.z.string().nonempty("Emergency contact is required"),
            bloodGroup: zod_1.z
                .enum(["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"])
                .optional(),
            presentAddress: zod_1.z.string().nonempty("Present address is required"),
            parmanentAddress: zod_1.z.string().nonempty("Permanent address is required"),
            guardian: guardianValidationSchema,
            localGuardian: localGuardianValidationSchema,
            profileImage: zod_1.z.string().optional(),
        }),
    }),
});
exports.studentValidations = { createStudentValidationSchema };
