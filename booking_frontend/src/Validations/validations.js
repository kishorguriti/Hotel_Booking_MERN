import { LoginSchema, SignUpSchema } from "./Schema";

export const ValidateLogin = async (values) => {
  try {
    await LoginSchema.validate(values, { abortEarly: false });
    return { isValid: true, errors: {} };
  } catch (errors) {
    const validationErrors = {};
    errors.inner.forEach((error) => {
      validationErrors[error.path] = error.message;
    });
    return { isValid: false, errors: validationErrors };
  }
};

export const ValidateRegister = async (values) => {
  try {
    await SignUpSchema.validate(values, { abortEarly: false });
    return { isValid: true, errors: {} };
  } catch (errors) {
    const validationErrors = {};
    errors.inner.forEach((error) => {
      validationErrors[error.path] = error.message;
    });
    return { isValid: false, errors: validationErrors };
  }
};
