import * as Yup from "yup";

export const LoginSchema = Yup.object().shape({
  username: Yup.string().required("Enter username"),
  password: Yup.string()
    .min(8, "Enter valid Password")
    .required("Enter Password"),
});

export const SignUpSchema = Yup.object().shape({
  email: Yup.string().email("Enter valid Email").required("*required"),
  password: Yup.string().min(8, "Enter valid Password").required("*required"),
  username: Yup.string().required("*required"),
});
