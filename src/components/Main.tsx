'use client';

import useAuth from "@/hooks/useAuth";
import Header from "./Header";
import { useTranslation } from "./i18n/client";
import { setLocale } from "yup";

interface MainProps {
    children: React.ReactNode;
}

const Main: React.FC<MainProps> = ({ children }) => {
    const { t } = useTranslation();
    const { loading } = useAuth();

    setLocale({
        mixed: {
            required: t('errors.required')
        },
        string: {
            url: t('errors.url'),
            email: t('errors.email'),
            min: ({min}) => t('errors.min', {min})
        }
    })

    if (loading) return <>{t('loading')}...</>;

    return (
        <>
            <Header />
            <main>{children}</main>
        </>
    );
}
export default Main;
