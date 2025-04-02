import { LoginType, sendLogin } from "@/util/request";
import { JSX, useState } from "react";
import { useCookies } from "react-cookie";
import { SubmitHandler, useForm } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";
import Link from "next/link";
import { useRouter } from "next/router";

const LoginPage: () => JSX.Element = () => {
    const router = useRouter();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginType>();

    const [disabled, setDisabled] = useState<boolean>(false);
    const [message, setMessage] = useState<string>("");
    const [, setCookie] = useCookies(["token", "refresh"]);

    const doLogin: SubmitHandler<LoginType> = ({ email, password }) => {
        setDisabled(true);
        setMessage("");
        sendLogin({ email, password })
            .then((response) => {
                console.log(response);
                setCookie("token", response.data.access, { maxAge: 86400, path: "/" });
                setCookie("refresh", response.data.refresh, { path: "/" });
                router.push("account");
            })
            .catch(({ response }) => {
                if (response.status === 400 && response.data.non_field_errors) {
                    setMessage(response.data.non_field_errors[0]);
                } else {
                    setMessage("Login Failed.");
                }
                setDisabled(false);
            });
    }

    return <form className="w-1/2 mt-10 m-auto" onSubmit={handleSubmit(doLogin)}>
        <div className="field">
            <label className="label-style">Email</label>
            <div className="control">
                <input
                    className="input-style"
                    type="string"
                    placeholder="Email"
                    {...register("email", { required: "This is required" })}
                />
                <div className="error">
                    <ErrorMessage errors={errors} name="email" />
                </div>
            </div>
        </div>
        <div className="field">
            <label className="label-style">Password</label>
            <div className="control">
                <input
                    className="input-style"
                    type="password"
                    placeholder="Password"
                    {...register("password", { required: "This is required" })}
                />
                <div className="error">
                    <ErrorMessage errors={errors} name="password" />
                </div>
            </div>
        </div>
        <div className="error">{message}</div>
        <span>Don&apos;t have an account? </span>
        <Link href="/register" className="text-[#007bff] hover:underline">Register</Link>
        <div className="field mt-5">
            <div className="btn-primary h-10 flex items-center justify-center">
                <input className="button" type="submit" value="Login" disabled={disabled}/>
            </div>
        </div>
    </form>
};

export default LoginPage;
