import * as Yup from 'yup';

export const schema = (t:any) => {
    return Yup.object().shape({
        endpoint: Yup.string().url().required(),
        body: Yup.string(),
        variables: Yup.string().test('is-json', t('errors.json'), (value) => {
            if (!value) return true;
            try {
                JSON.parse(value);
                return true;
            } catch (e) {
                return false;
            }
        }),
        headers: Yup.array().of(
            Yup.object().shape({
                key: Yup.string().required(),
                value: Yup.string().required(),
            })
        ),
    });
};
