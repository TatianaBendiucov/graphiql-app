import { createInstance } from 'i18next';
import resourcesToBackend from 'i18next-resources-to-backend';
import { initReactI18next } from 'react-i18next/initReactI18next';
import { cookieName, fallbackLng, getOptions } from './settings';
import { cookies } from 'next/headers';

const initI18next = async (lng:string, ns:string) => {
  const i18nInstance = createInstance();
  await i18nInstance
    .use(initReactI18next)
    .use(resourcesToBackend((lang:string, namespace:string) => {
      return import(`./locales/${lang}/${namespace}.json`);
    }))
    .init(getOptions(lng, ns));
  return i18nInstance;
};

export async function useTranslation(ns = 'translation') {
  const lngCookie = cookies().get(cookieName);
  const lng = lngCookie ? lngCookie.value : fallbackLng;
  const i18nextInstance = await initI18next(lng, ns);
  
  return {
    t: i18nextInstance.getFixedT(lng, Array.isArray(ns) ? ns[0] : ns),
    i18n: i18nextInstance
  };
}
