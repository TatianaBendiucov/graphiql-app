import * as yup from 'yup';

export const schema = yup.object().shape({
    email: yup.string()
        .email('Invalid email format')
        .required('Email is required'),
    password: yup.string()
        .matches(/[A-Za-z]/, "Password must contain at least one letter")
        .matches(/\d/, "Password must contain at least one number")
        .matches(
            /[!@#$%^&*(),.?":{}|<>]/,
            "Password must contain at least one special character",
        )
        .min(6, 'Password must be at least 6 characters')
        .required('Password is required'),
});