import { HttpMethod } from '@/types/routesTypes';
import { TFunction } from 'i18next';
import * as Yup from 'yup';

export const schema = (t: TFunction) => {
  return Yup.object().shape({
    method: Yup.mixed<HttpMethod>()
      .oneOf(Object.values(HttpMethod), t('errors.invalidRequestType'))
      .required(),
    endpoint: Yup.string().url().required(),
    body: Yup.string().when('method', {
      is: HttpMethod.POST,
      then: (body) => body.required(),
      otherwise: (body) => body.notRequired(),
    }),
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
      }),
    ),
  });
};
