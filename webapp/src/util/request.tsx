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
    contact_first_name: string;
    contact_last_name: string;
    contact_email: string;
    contact_phone_number: string;
    charity_name: string;
    charity_email: string;
    charity_phone_number: string;
    is_approved: boolean;
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
    donations_list: Array<[number, Date]>;
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

export const sendCharity: (data: CharityFormData) => 
    Promise<AxiosResponse<{ message: string }>> = (data) => 
        backendConfig.post("charity/", data);


export const getAccountInfo: () => Promise<AxiosResponse<AccountType>> = () => backendConfig.get("account/");

export const getUserDonations: () => Promise<AxiosResponse<DonationsListType>> = () => backendConfig.get("user-donations/");