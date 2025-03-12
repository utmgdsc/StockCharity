import { GetServerSideProps } from "next";
import { JSX } from "react";

const Homepage = (): JSX.Element => <h1>Stock Charity</h1>;

export const getServerSideProps: GetServerSideProps = async () => {
    return {
        redirect: {
            destination: "/home",
            permanent: true,
        },
    };
};

export default Homepage;