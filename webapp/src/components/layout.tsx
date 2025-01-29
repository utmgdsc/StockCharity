import { JSX } from "react"; 
import NavBar from "./navbar";

const Layout = ({ children }: { children: JSX.Element }) => {
    return (
        <>
            <NavBar />
            <main>{children}</main>

        </>
    );
};

export default Layout;
