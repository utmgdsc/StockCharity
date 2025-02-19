import { RegisterType, sendRegister } from "@/util/request";
import { ErrorMessage } from "@hookform/error-message";
import Link from "next/link";
import { useRouter } from "next/router";
import { JSX, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

const RegisterPage: () => JSX.Element = () => {
    const router = useRouter();
    const {
        register,
        handleSubmit,
        getValues,
        setError,
        formState: { errors },
    } = useForm<RegisterType>();

    const [message, setMessage] = useState<string>("");

    const doRegister: SubmitHandler<RegisterType> = (data) => {
        setMessage("");
        sendRegister(data)
            .then((response) => {
                router.push("login");
            })
            .catch(({ response }) => {
                if (response.status === 400) {
                    const registerErrors: Record<string, string[]> = response.data;
                    if (registerErrors.non_field_errors) {
                        setMessage(registerErrors.non_field_errors.join());
                        delete registerErrors.non_field_errors;
                    }
                    Object.entries(registerErrors).forEach(([field, e]) => {
                        setError(field as "email", { type: "400", message: e[0] });
                    });
                } else {
                    setMessage("Register Failed");
                }
            });
    };
    return <form className="w-1/2 m-auto" onSubmit={handleSubmit(doRegister)}>
        <div className="flex flex-row gap-x-2">
            <div className="field grow">
                <label className="label-style">First Name</label>
                <div className="control">
                    <input
                        className="input-style"
                        type="string"
                        placeholder="First Name"
                        {...register("first_name", { required: "This is required" })}
                    />
                    <div className="error">
                        <ErrorMessage errors={errors} name="first_name" />
                    </div>
                </div>
            </div>
            <div className="field grow">
                <label className="label-style">Last Name</label>
                <div className="control">
                    <input
                        className="input-style"
                        type="string"
                        placeholder="Last Name"
                        {...register("last_name", { required: "This is required" })}
                    />
                    <div className="error">
                        <ErrorMessage errors={errors} name="last_name" />
                    </div>
                </div>
            </div>
        </div>
        <div className="field">
            <label className="label-style">Email</label>
            <div className="control">
                <input
                    className="input-style"
                    type="email"
                    placeholder="email"
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
                    {...register("password1", { required: "This is required" })}
                />
                <div className="error">
                    <ErrorMessage errors={errors} name="password1" />
                </div>
            </div>
        </div>
        <div className="field">
            <label className="label-style">Repeat Password</label>
            <div className="control">
                <input
                    className="input-style"
                    type="password"
                    placeholder="Repeat Password"
                    {...register("password2", {
                        required: "This is required",
                        validate: (value) => {
                            if (value !== getValues("password1")) {
                                return "Passwords do not match";
                            }
                            return undefined;
                        },
                    })}
                />
                <div className="error">
                    <ErrorMessage errors={errors} name="password2" />
                </div>
            </div>
        </div>
        <div>{message}</div>
        <Link href="/login">Already have an account? Sign In</Link>
        <div className="field mt-5">
            <div className="control">
                <input className="button" type="submit" value="Register" />
            </div>
        </div>
    </form>
}

export default RegisterPage;
