import Header from "@/components/header";

const Layout = ({ children }: { children: JSX.Element }) => {
    return (
        <>
            <Header />
            <main className="mt-20 md:w-2/3 w-11/12 m-auto">{children}</main>
        </>
    );
};

export default Layout;
