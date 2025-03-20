import axios, { AxiosResponse } from "axios";
import Cookie from "js-cookie";


const BASE_URL = "http://localhost:8000/";

const backendConfig = axios.create({
    baseURL: BASE_URL,
});

backendConfig.interceptors.request.use((config) => {
    // Check if we're logged in and can provide an auth token
    const token = Cookie.get("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

/* Auto refresh token */
backendConfig.interceptors.response.use(response => response, (error) => {
    console.log(error);
    if (error.response.status == 401 && !error.config._refresh_retry && error.response.data.code === "token_not_valid") {
        error.config._refresh_retry = true;
        const refresh_cookie = Cookie.get("refresh");
        if (refresh_cookie) {
            return backendConfig.post("login/refresh/", { "refresh": refresh_cookie }).then((refresh_response) => {
                Cookie.set("token", refresh_response.data.access);
                return backendConfig(error.config);
            }).catch((refresh_error) => {
                console.log(refresh_error);
                return error;
            })
        }
    }
    return error
})

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
    phone_number: string;
    is_staff: boolean;
    is_active: boolean;
    total_dividends: number;
    total_donations: number;
};

export type DonationsListType = {
    // amount: Array<number>;
    // date: Array<Date>;
    donations_list: Array<[number, Date]>;
};

export type CharityType = {
    id: number;
    email: string;
    name: string;
    phone_number: string;
    donations_received: number;
    is_approved: boolean;
    logo_path: string;
    description: string;
}

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

export const getCharities: () => Promise<AxiosResponse<CharityType[]>> = () => backendConfig.get("charity/")

export const setCharityApproved: (id: number, approved: boolean) => Promise<AxiosResponse<CharityType>> = (id: number, approved: boolean) => backendConfig.patch(`charity/${id}/`, { "is_approved": approved })
