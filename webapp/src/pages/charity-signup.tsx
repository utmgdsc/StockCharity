import React from "react";
import { CharityFormData } from "@/util/request";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axios from "axios";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

const validatePhoneNumber = (phone: string) => {

  if (!phone) return false;

  const formattedPhone = phone.startsWith("+") ? phone : `+${phone}`;
  const parsed = parsePhoneNumberFromString(formattedPhone);
  return parsed && parsed.isValid();
};

const schema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  charityName: z.string().min(1, "Charity name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().refine(validatePhoneNumber, {
    message: "Invalid phone number format",
  }),
  message: z.string().optional(),
  isAgreed: z.boolean().refine(val => val === true, "You must accept the privacy policy"),
});

const CharitySignUp: React.FC = () => {
  const [isAgreed, setIsAgreed] = useState(false);
  const [userCountry, setUserCountry] = useState("can"); 
  const [phoneNumber, setPhoneNumber] = useState("+");

  const {
    register,
    setValue,
    trigger,
    formState: { errors, isValid },
  } = useForm<CharityFormData>({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: {
      firstName: "",
      lastName: "",
      charityName: "",
      email: "",
      phone: "",
      message: "",
      isAgreed: false,
    },
  });

  const handlePhoneChange = (value: string) => {
    setPhoneNumber(value); 
    setValue("phone", value); 
    trigger("phone");
  };
  
  useEffect(() => {
    axios.get("https://ipapi.co/json/")
      .then((response) => {
        setUserCountry(response.data.country_code.toLowerCase());
      })
      .catch(() => console.log("Could not fetch user location"));
  }, []);

  const toggleAgreement = () => {
    setIsAgreed(!isAgreed);
    setValue("isAgreed", !isAgreed); 
    trigger("isAgreed");
  };

  return (
    <div className="grid grid-cols-2 relative isolate bg-white px-6 py-24 sm:py-10 lg:px-8">
      <div
        className="absolute inset-x-0 top-[-10rem] -z-10 transform overflow-hidden blur-3xl sm:top-[-20rem]"
        aria-hidden="true"
      >
        <div
          className="relative left-1/2 w-[36.125rem] -translate-x-1/2"
        ></div>
      </div>

      <div className="mx-auto w-full max-w-lg grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="text-center md:text-left flex flex-col justify-start">
            <h2 className="text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
                Charity Sign-Up      
            </h2>
            <p className="mt-4 text-lg text-gray-600">
                Register as a charity today!
            </p>
            <ul className="list-disc list-inside text-gray-600">
                <li>Requirement 1</li>
                <li>Requirement 2</li>
            </ul>          
        </div>
      </div>

      <form action="#" method="POST" className="mx-auto w-full max-w-lg sm:mt-0">
        <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
          <div>
            <label htmlFor="first-name" className="label-style"> First name</label>   
            <div className="mt-2.5">
              <input
                type="text"
                {...register("firstName")}
                id="first-name"
                autoComplete="given-name"
                className="input-style"
              />
              {errors.firstName && <p className="text-red-500">{errors.firstName.message}</p>}
            </div>
          </div>
          
          <div>
            <label htmlFor="last-name" className="label-style">Last name</label>
            <div className="mt-2.5">
              <input
                type="text"
                {...register("lastName")}
                id="last-name"
                autoComplete="family-name"
                className="input-style"
              />
               {errors.lastName && <p className="text-red-500">{errors.lastName.message}</p>}
            </div>
          </div>
          
          <div className="sm:col-span-2">
            <label htmlFor="charity-name" className="label-style">Charity Name</label>
            <div className="mt-2.5">
              <input
                type="text"
                {...register("charityName")}
                id="charity-name"
                autoComplete="organization"
                className="input-style"
              />
              {errors.charityName && <p className="text-red-500">{errors.charityName.message}</p>}
            </div>
          </div>
          
          <div className="sm:col-span-2">
            <label htmlFor="email"className="label-style"> Email </label>
            <div className="mt-2.5">
              <input
                type="email"
                {...register("email")}
                id="email"
                autoComplete="email"
                className="input-style"
              />
              {errors.email && <p className="text-red-500">{errors.email.message}</p>}
            </div>
          </div>
          
          <div className="sm:col-span-2">
            <label htmlFor="phone-number" className="label-style">Phone number</label>
            <div className="mt-2.5">
              <div className="flex rounded-md border border-gray-300 bg-white focus-within:ring-2 focus-within:ring-blue-600 focus-within:ring-offset-2">
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
              </div>
              {errors.phone && <p className="text-red-500">{errors.phone.message}</p>}
            </div>
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="message" className="label-style">Message</label>
            <div className="mt-2.5">
              <textarea
                {...register("message")}
                id="message"
                rows={3}
                className="input-style"
              ></textarea>
            </div>
          </div>

          {/* Privacy Agreement Section */}
          <div className="flex items-center gap-x-4 sm:col-span-2">
            <button
              type="button"
              className={`relative flex w-8 h-4 cursor-pointer rounded-full ${
                isAgreed ? "bg-blue-500" : "bg-gray-200"
              } transition-colors duration-200 ease-in-out`}
              role="switch"
              aria-checked={isAgreed}
              onClick={toggleAgreement}
            >
              <span
                aria-hidden="true"
                className={`block h-4 w-4 transform rounded-full bg-white shadow ring-1 ring-gray-300 transition duration-200 ease-in-out ${
                  isAgreed ? "translate-x-4" : "translate-x-0"
                }`}
              ></span>
            </button>

            <label className="text-sm text-gray-600">
              By selecting this, you agree to our{" "}
              <a href="#" className="font-semibold text-blue-600">
                privacy&nbsp;policy
              </a>
              .
            </label>
          </div>
          {errors.isAgreed && <p className="text-red-500">{errors.isAgreed.message}</p>}
        </div>
        
        <div className="mt-10">
          <button
            type="submit"
            disabled={!isValid}
            className={`btn-primary px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm w-full ${
              isValid ? "bg-blue-500 hover:bg-blue-600" : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            Submit
          </button>
        </div>
        
      </form>
    </div>
  );
};

export default CharitySignUp;
