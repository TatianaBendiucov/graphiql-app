'use client';

import useAuth from '@/hooks/useAuth';
import Header from './Header';
import { useTranslation } from './i18n/client';
import { setLocale } from 'yup';
import Image from 'next/image';
import ButtonBase from './Button';

interface MainProps {
  children: React.ReactNode;
}

const Main: React.FC<MainProps> = ({ children }) => {
  const { t } = useTranslation();
  const { loading } = useAuth();

  setLocale({
    mixed: {
      required: t('errors.required'),
    },
    string: {
      url: t('errors.url'),
      email: t('errors.email'),
      min: ({ min }) => t('errors.min', { min }),
    },
  });

  if (loading) return <>{t('loading')}...</>;

  return (
    <>
      <Header />
      <main>{children}</main>
      <footer className="main-footer">
        <div className="main-footer__inner">
          <div>
            <ButtonBase
              href="https://github.com/00oleg"
              target="_blank"
              variant={'text'}
            >
              Oleg
            </ButtonBase>
            |
            <ButtonBase
              href="https://github.com/TatianaBendiucov"
              target="_blank"
              variant={'text'}
            >
              Tatiana
            </ButtonBase>
          </div>
          <span>2024</span>
          <ButtonBase
            href="https://rs.school/courses/reactjs"
            target="_blank"
            variant={'text'}
          >
            <Image
              src={'./rss-logo.svg'}
              width="50"
              height="50"
              alt={'RS Logo'}
            />
          </ButtonBase>
        </div>
      </footer>
    </>
  );
};
export default Main;
