
import { JSX } from "react"; 
import Header from "@/components/header";
const Layout = ({ children }: { children: JSX.Element }) => {
    return (
        <>

            <main>{children}</main>
        </>
    );
};

export default Layout;
