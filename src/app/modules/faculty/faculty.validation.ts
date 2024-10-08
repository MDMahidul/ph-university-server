import { z } from 'zod';
import { BloodGroup,facultyDesignation, Gender } from './faculty.constant';

const userNameValidationSchema = z.object({
  firstName: z
    .string()
    .nonempty('First name is required')
    .max(20, 'First name can not be more than 20 characters')
    .refine(
      (value) => value.charAt(0).toUpperCase() + value.slice(1) === value,
      { message: 'First name must be capitalized' },
    ),
  middleName: z.string().optional(),
  lastName: z.string().nonempty('Last name is required'),
});

const createFacultyValidationSchema = z.object({
  body: z.object({
    password: z.string().max(20).optional(),
    faculty: z.object({
      name: userNameValidationSchema,
      designation: z.enum([...facultyDesignation] as [string, ...string[]], {}),
      gender: z.enum([...Gender] as [string, ...string[]], {}),
      dateOfBirth: z.string().optional(),
      email: z
        .string()
        .nonempty("Email is required")
        .email("Invalid email format"),
      contactNo: z.string().nonempty("Contact is required"),
      emergencyContactNo: z.string().nonempty("Emergency contact is required"),
      bloodGroup: z.enum([...BloodGroup] as [string, ...string[]]).optional(),
      presentAddress: z.string().nonempty("Present address is required"),
      permanentAddress: z.string().nonempty("Permanent address is required"),
      academicDepartment: z.string(),
    }),
  }),
});

const updateUserNameValidationSchema = z.object({
  firstName: z.string().min(1).max(20).optional(),
  middleName: z.string().optional(),
  lastName: z.string().optional(),
});

const updateFacultyValidationSchema = z.object({
  body: z.object({
    faculty: z.object({
      name: updateUserNameValidationSchema.optional(),
      designation: z
        .enum([...facultyDesignation] as [string, ...string[]])
        .optional(),
      gender: z.enum([...Gender] as [string, ...string[]]).optional(),
      dateOfBirth: z.string().optional(),
      email: z.string().email().optional(),
      contactNo: z.string().optional(),
      emergencyContactNo: z.string().optional(),
      bloogGroup: z.enum([...BloodGroup] as [string, ...string[]]).optional(),
      presentAddress: z.string().optional(),
      permanentAddress: z.string().optional(),
      academicDepartment: z.string().optional(),
    }),
  }),
});

export const facultyValidations = {
  createFacultyValidationSchema,
  updateFacultyValidationSchema,
};
