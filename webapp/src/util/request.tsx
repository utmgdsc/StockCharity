import axios, { AxiosResponse } from "axios";
import Cookie from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { LineGraphProps } from "@/components/line-graph";


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

const refreshToken: () => Promise<void> = () => {
    const refresh_cookie = Cookie.get("refresh");
    if (refresh_cookie) {
        return backendConfig.post("login/refresh/", { "refresh": refresh_cookie }).then(refresh_response => {
            Cookie.set("token", refresh_response.data.access);
            return Promise.resolve();
        }).catch((refresh_error) => {
            Cookie.remove("token");
            Cookie.remove("refresh");
            return Promise.reject(refresh_error);
        });
    }
    return Promise.reject();
}

/* Auto refresh token */
backendConfig.interceptors.response.use(response => response, error => {
    if (error.response.status === 401 && !error.config?._refresh_retry && error.config.url !== "login/refresh/") {
        error.config._refresh_retry = true;
        return refreshToken().then(() => backendConfig(error.config)).catch(() => error);
    }
    return Promise.reject(error);
})

export const isLoggedIn: () => Promise<void> = async () => {
    const cookie = Cookie.get("token");
    if (cookie) {
        try {
            const { exp } = jwtDecode(cookie);
            const date = new Date();
            if (exp && exp < date.getTime() / 1000) {
                return refreshToken();
            }
            return Promise.resolve();
        } catch {
        }
    }
    return Promise.reject();
}

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
    phone_number: string;
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
    phone_number: string;
    is_staff: boolean;
    is_active: boolean;
    total_dividends: number;
    total_donations: number;
    donations: {
        amount: number;
        date: string;
        status: string;
    }[];
};

export type CharityType = {
    id: number;
    charity_email: string;
    charity_name: string;
    charity_phone_number: string;
    donations_received: number;
    is_approved: boolean;
    logo_path: string;
    description: string;
}

export type CharityNumType = {
    totalCharities: number;
}

export type DonationsTotalType = {
    donation_total: number;
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

export const sendCharity: (data: CharityFormData) =>
    Promise<AxiosResponse<{ message: string }>> = (data) =>
        backendConfig.post("charity/", data);


export const getAccountInfo: () => Promise<AxiosResponse<AccountType>> = () => backendConfig.get("account/");

export const getCharities: () => Promise<AxiosResponse<CharityType[]>> = () => backendConfig.get("charity/");

export const setCharityApproved: (id: number, approved: boolean) => Promise<AxiosResponse<CharityType>> = (id: number, approved: boolean) => backendConfig.patch(`charity/${id}/`, { "is_approved": approved })

export const getTotalCharities: () => Promise<AxiosResponse<CharityNumType>> = () => backendConfig.get("total-charities/")

export const getTotalDonations: () => Promise<AxiosResponse<DonationsTotalType>> = () => backendConfig.get("total-donations/")

export const getTotalDividends: () => Promise<AxiosResponse<{ total_dividends: number }>> = () => backendConfig.get("dividend/total");

export const getMonthlyDonations: () => Promise<AxiosResponse<LineGraphProps>> = () => backendConfig.get("monthly-donations/");