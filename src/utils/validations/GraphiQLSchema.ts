import * as Yup from 'yup';

export const schema = (t:any) => {
    return Yup.object().shape({
        endpoint: Yup.string().url().required(),
        sdlEndpoint: Yup.string().url(),
        query: Yup.string().required(),
        variables: Yup.string().test('is-json', t('errors.json'), (value) => {
            if (!value) return true; // Allow empty string
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
}
