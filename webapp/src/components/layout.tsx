import {JSX} from 'react';

const Layout = ({ children }: { children: JSX.Element }) => {
    return (
        <>

            <main>{children}</main>
        </>
    );
};

export default Layout;
