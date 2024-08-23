import * as Yup from 'yup';

export const schema = Yup.object().shape({
    endpoint: Yup.string().url('Invalid URL format').required('Endpoint is required'),
    body: Yup.string(),
    variables: Yup.string().test('is-json', 'Variables must be valid JSON', (value) => {
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
            key: Yup.string().required('Header key is required'),
            value: Yup.string().required('Header value is required'),
        })
    ),
});