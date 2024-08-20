'use client';

import useAuth from "@/hooks/useAuth";
import Header from "./Header";

interface MainProps {
    children: React.ReactNode;
}

const Main: React.FC<MainProps> = ({ children }) => {
    const { loading } = useAuth();

    if (loading) return <>loading...</>;

    return <>
        <Header />
        <main>{children}</main>
    </>;
}
export default Main;