import { useTranslation } from '../components/i18n';

export default async function Home() {
  const { t } = await useTranslation();

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      {t('home')}
    </main>
  );
}
