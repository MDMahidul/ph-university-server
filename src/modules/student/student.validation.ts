import {z} from 'zod';

const userNameSchemaValidation = z.object({
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

const guardianSchemaValidation = z.object({
  fatherName: z.string().nonempty("Father name is required"),
  fatherOccupation: z.string().nonempty("Father occupation is required"),
  fatherContactNo: z.string().nonempty("Father contact is required"),
  motherName: z.string().nonempty("Mother name is required"),
  motherOccupation: z.string().nonempty("Mother occupation is required"),
  motherContactNo: z.string().nonempty("Mother contact is required"),
});

const localGuardianSchemaValidation = z.object({
  name: z.string().nonempty("LG name is required"),
  occupation: z.string().nonempty("LG occupation is required"),
  contactNo: z.string().nonempty("LG contact is required"),
  address: z.string().nonempty("LG address is required"),
});

// Main schema: Student
const studentValidationSchema = z.object({
  id: z.string(),
  name: userNameSchemaValidation,
  gender: z.enum(["male", "female", "others"], {
    errorMap: () => ({
      message: "Gender can only be 'male', 'female', or 'others'",
    }),
  }),
  dateOfBirth: z.string().nonempty("DOB is required"),
  email: z.string().nonempty("Email is required").email("Invalid email format"),
  contactNo: z.string().nonempty("Contact is required"),
  emergencyContactNo: z.string().nonempty("Emergency contact is required"),
  bloodGroup: z
    .enum(["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"])
    .optional(),
  presentAddress: z.string().nonempty("Present address is required"),
  parmanentAddress: z.string().nonempty("Permanent address is required"),
  guardian: guardianSchemaValidation,
  localGuardian: localGuardianSchemaValidation,
  profileImage: z.string().optional(),
  isActive: z.enum(["active", "blocked"]).default("active"),
  isDelete: z.boolean(),
});

export default studentValidationSchema;