import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Main from '@/components/Main';
import ClientThemeProvider from '@/utils/ClientThemeProvider';
import { dir } from 'i18next';
import {
  cookieName,
  fallbackLng,
  languages,
} from '../components/i18n/settings';
import { getCookie } from 'cookies-next';
import ErrorBoundary from '@/components/ErrorBoundary';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'RSS school',
  description: 'RSS school',
};

export async function generateStaticParams() {
  return languages.map((lng) => ({ lng }));
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const lng = getCookie(cookieName) || fallbackLng;

  return (
    <html lang={lng} dir={dir(lng)}>
      <body className={inter.className}>
        <ErrorBoundary>
          <ClientThemeProvider>
            <Main>{children}</Main>
          </ClientThemeProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
