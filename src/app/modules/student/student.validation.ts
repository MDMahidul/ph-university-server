import { z } from "zod";

const userNameValidationSchema = z.object({
  firstName: z
    .string()
    .nonempty("First name is required")
    .max(20, "First name cannot be more than 20 characters")
    .refine(
      (value) => value.charAt(0).toUpperCase() + value.slice(1) === value,
      {
        message: "First name must be capitalized",
      }
    ),
  middleName: z.string().optional(),
  lastName: z.string().nonempty("Last name is required"),
});

const guardianValidationSchema = z.object({
  fatherName: z.string().nonempty("Father name is required"),
  fatherOccupation: z.string().nonempty("Father occupation is required"),
  fatherContactNo: z.string().nonempty("Father contact is required"),
  motherName: z.string().nonempty("Mother name is required"),
  motherOccupation: z.string().nonempty("Mother occupation is required"),
  motherContactNo: z.string().nonempty("Mother contact is required"),
});

const localGuardianValidationSchema = z.object({
  name: z.string().nonempty("LG name is required"),
  occupation: z.string().nonempty("LG occupation is required"),
  contactNo: z.string().nonempty("LG contact is required"),
  address: z.string().nonempty("LG address is required"),
});

// Main schema: Student
const createStudentValidationSchema = z.object({
  body: z.object({
    password: z.string().max(20),
    student: z.object({
      name: userNameValidationSchema,
      gender: z.enum(["male", "female", "others"], {
        errorMap: () => ({
          message: "Gender can only be 'male', 'female', or 'others'",
        }),
      }),
      dateOfBirth: z.date().optional(),
      email: z
        .string()
        .nonempty("Email is required")
        .email("Invalid email format"),
      contactNo: z.string().nonempty("Contact is required"),
      emergencyContactNo: z.string().nonempty("Emergency contact is required"),
      bloodGroup: z
        .enum(["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"])
        .optional(),
      presentAddress: z.string().nonempty("Present address is required"),
      parmanentAddress: z.string().nonempty("Permanent address is required"),
      guardian: guardianValidationSchema,
      localGuardian: localGuardianValidationSchema,
      profileImage: z.string().optional(),
    }),
  }),
});

export const studentValidations={createStudentValidationSchema};
