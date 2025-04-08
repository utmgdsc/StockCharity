import { RegisterType, sendRegister } from "@/util/request";
import { ErrorMessage } from "@hookform/error-message";
import Link from "next/link";
import { useRouter } from "next/router";
import { JSX, useState, useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import axios from "axios";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";


const validatePhoneNumber = (phone: string) => {

    if (!phone) return false;
  
    const formattedPhone = phone.startsWith("+") ? phone : `+${phone}`;
    const parsed = parsePhoneNumberFromString(formattedPhone);
    return parsed && parsed.isValid();
};

export const schema = z.object({
    first_name: z.string().min(1, "First name is required"),  
    last_name: z.string().min(1, "Last name is required"),    
    email: z.string().email("Invalid email address"),
    phone_number: z.string().refine(validatePhoneNumber, {
      message: "Invalid phone number format",
    }),
    password1: z.string().min(6, "Password must be at least 6 characters long"),  
    password2: z.string().min(6, "Password must be at least 6 characters long"),
  }).refine((data) => data.password1 === data.password2, {
    message: "Passwords must match",
    path: ["password2"],
  });

const RegisterPage: () => JSX.Element = () => {
    const router = useRouter();
    const {
        register,
        handleSubmit,
        getValues,
        setError,
        trigger,
        setValue, 
        formState: { errors },
    } = useForm<RegisterType>({
        resolver: zodResolver(schema), 
        mode: "onSubmit"
        });

    const [message, setMessage] = useState<string>("");
    const [phoneNumber, setPhoneNumber] = useState<string>("");
    const [userCountry, setUserCountry] = useState<string>("us"); // Default country

    useEffect(() => {
        axios.get("https://ipapi.co/json/")
            .then((response) => {
                setUserCountry(response.data.country_code.toLowerCase());
            })
            .catch(() => console.log("Could not fetch user location"));
    }, []);

    const handlePhoneChange = (value: string) => {
        const formattedValue = value.startsWith("+") ? value : `+${value}`;
        setPhoneNumber(formattedValue);
        setValue("phone_number", formattedValue);
        trigger("phone_number");
    };

    const doRegister: SubmitHandler<RegisterType> = (data) => {
        setMessage("");
        sendRegister(data)
            .then(() => {
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
    return <form className="w-1/2 mt-10 m-auto" onSubmit={handleSubmit(doRegister)}>
        <div className="flex flex-row gap-x-2">
            <div className="field grow">
                <label className="label-style">First Name</label>
                <div className="control">
                    <input
                        className="input-style"
                        type="string"
                        placeholder="First Name"
                        {...register("first_name")}
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
                        {...register("last_name")}
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
                    {...register("email")}
                />
                <div className="error">
                    <ErrorMessage errors={errors} name="email" />
                </div>
            </div>
        </div>

        <div className="field">
                <label className="label-style">Phone Number</label>
                <div className="control">
                    <PhoneInput
                        country={userCountry}
                        value={phoneNumber}
                        onChange={handlePhoneChange}
                        inputStyle={{
                            width: "100%",
                            height: "40px",
                            borderRadius: "5px",
                            border: "1px solid #ccc",
                            paddingLeft: "50px",
                        }}
                    />
                    <div className="error">
                        <ErrorMessage errors={errors} name="phone_number" />
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
                    {...register("password1")}
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
                        required: "Please re-enter your password",
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
        <span>Already have an account? </span>
        <Link href="/login" className="text-[#007bff] hover:underline">Log In</Link>
        <div className="field mt-5">
            <div className="btn-primary h-10 flex items-center justify-center">
                <input className="button" type="submit" value="Register" />
            </div>
        </div>
    </form>
}

export default RegisterPage;
