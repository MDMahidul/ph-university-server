import { z } from 'zod';

const createAcademicDepartmentValidationSchema = z.object({
  body: z.object({
    name: z
      .string({
        invalid_type_error: 'Academic Department must be string!',
      })
      .nonempty('Academic Department name required!'),
    academicFaculty: z
      .string({
        invalid_type_error: 'Academic Faculty must be string!',
      })
      .nonempty('Faculty is required!'),
  }),
});
const updateAcademicDepartmentValidationSchema = z.object({
  body: z.object({
    name: z
      .string({
        invalid_type_error: 'Academic Department must be string!',
      }).optional(),
    academicFaculty: z
      .string({
        invalid_type_error: 'Academic Faculty must be string!',
      }).optional()
  }),
});

export const AcademicDepartmentValidation = {
  createAcademicDepartmentValidationSchema,
  updateAcademicDepartmentValidationSchema,
};
