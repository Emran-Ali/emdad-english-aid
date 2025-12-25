import * as yup from 'yup';

// Server-side validation schema for batch creation
export const batchSchema = yup
  .object({
    // batchCode is generated server-side, do not require from client
    name: yup
      .string()
      .required('Name is required')
      .max(200, "Name can't exceed 200 characters"),
    type: yup
      .mixed()
      .oneOf(
        ['hsc_1st_year', 'hsc_2nd_year', 'admission', 're_admission'],
        'Invalid batch type',
      )
      .required('Type is required'),
    academicYear: yup
      .number()
      .positive()
      .integer()
      .required('Academic year is required'),
    maxStudents: yup
      .number()
      .positive()
      .integer()
      .required('Max students is required'),
    startDate: yup.date().nullable(),
    endDate: yup.date().nullable(),
    batchTime: yup.string().nullable(),
    fees: yup.number().nullable(),
    isActive: yup.boolean().default(true),
  })
  .required();

export async function validateBatchPayload(payload) {
  try {
    const validated = await batchSchema.validate(payload, {
      abortEarly: false,
      stripUnknown: true,
    });
    return {valid: true, data: validated, errors: null};
  } catch (err) {
    if (err.inner && Array.isArray(err.inner)) {
      const errors = err.inner.reduce((acc, cur) => {
        if (cur.path) acc[cur.path] = cur.message;
        return acc;
      }, {});
      return {valid: false, data: null, errors};
    }
    return {valid: false, data: null, errors: {message: err.message}};
  }
}
