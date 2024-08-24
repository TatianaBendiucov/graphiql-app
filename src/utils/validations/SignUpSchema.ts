import * as yup from 'yup';

export const schema = (t:any) => {
    return yup.object().shape({
        email: yup.string()
            .email()
            .required(),
        password: yup.string()
            .required()
            .matches(/[A-Za-z]/, t('errors.least_one_letter'))
            .matches(/\d/, t('errors.least_one_number'))
            .matches(
                /[!@#$%^&*(),.?":{}|<>]/,
                t('errors.least_one_special_character')
            )
            .min(6),
    });
};
