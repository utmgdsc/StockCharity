import { JSX } from "react";
import { useRouter } from "next/router"; 
import NavBar from "./navbar";
import Footer from "./footer";

const showFooterOn = ["/charity-signup", "/about-us", "/home"]; 

const Layout = ({ children }: { children: JSX.Element }) => {
    const router = useRouter(); 
    return (
        <div className="flex flex-col min-h-screen">
            <NavBar />
            <main className="flex-1">{children}</main>

            {/* Conditionally render the Footer based on the page */}
            {showFooterOn.includes(router.pathname) && <Footer />}
        </div>
    );
};

export default Layout;
