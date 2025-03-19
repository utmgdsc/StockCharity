import axios, { AxiosResponse } from "axios";
import cookie from "cookie";


const BASE_URL = "http://localhost:8000/";

const backendConfig = axios.create({
    baseURL: BASE_URL,
});

backendConfig.interceptors.request.use((config) => {
    // Check if we're logged in and can provie an auth token
    const token = cookie.parse(document.cookie)?.token;
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export type LoginType = {
    email: string;
    password: string;
};

export type RegisterType = {
    email: string;
    password1: string;
    password2: string;
    first_name: string;
    last_name: string;
    phone: string;
}

export type CharityFormData = {
    firstName: string;
    lastName: string;
    charityName: string;
    email: string;
    phone: string;
    message?: string;
    isAgreed: boolean;
}

export type AccountType = {
    email: string;
    first_name: string;
    last_name: string;
    total_dividends: number;
    total_donations: number;
};

export type DonationsListType = {
    // amount: Array<number>;
    // date: Array<Date>;
    donations_list: Array<[number, string]>;
};

export const sendRegister: (
    data: RegisterType
) => Promise<AxiosResponse<AccountType>> = (data) =>
        backendConfig.post("register/", data);

export const sendLogin: ({
    email,
    password,
}: LoginType) => Promise<AxiosResponse<{ refresh: string, access: string }>> = ({
    email,
    password,
}) => backendConfig.post("login/", { email, password });


export const getAccountInfo: () => Promise<AxiosResponse<AccountType>> = () => backendConfig.get("account/");

export const getUserDonations: () => Promise<AxiosResponse<DonationsListType>> = () => backendConfig.get("user-donations/");