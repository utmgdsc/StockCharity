import React from "react";
import { CharityFormData, sendCharity } from "@/util/request";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axios from "axios";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import Link from "next/link";

const validatePhoneNumber = (phone: string) => {

  if (!phone) return false;

  const formattedPhone = phone.startsWith("+") ? phone : `+${phone}`;
  const parsed = parsePhoneNumberFromString(formattedPhone);
  return parsed && parsed.isValid();
};

const schema = z.object({
  contact_first_name: z.string().min(1, "First name is required"),
  contact_last_name: z.string().min(1, "Last name is required"),
  contact_email: z.string().email("Invalid email address"),
  contact_phone_number: z.string().refine(validatePhoneNumber, {
    message: "Invalid phone number format",
  }),
  charity_name: z.string().min(1, "Charity name is required"),
  charity_email: z.string().email("Invalid email address"),
  charity_phone_number: z.string().refine(validatePhoneNumber, {
    message: "Invalid phone number format",
  }),
  is_approved: z.boolean().refine(val => val === true, "You must accept the privacy policy"),
});

const CharitySignUp: React.FC = () => {
  const [isAgreed, setIsAgreed] = useState(false);
  const [userCountry, setUserCountry] = useState("can"); 
  const [phoneNumber, setPhoneNumber] = useState("+");

  const {
    register,
    setValue,
    trigger,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<CharityFormData>({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: {
      contact_first_name: "",
      contact_last_name: "",
      contact_email: "",
      contact_phone_number: "",
      charity_name: "",
      charity_email: "",
      charity_phone_number: "",
      is_approved: false,
    },
  });

  

  const handleCharityPhoneChange = (value: string) => {
    setPhoneNumber(""); 
    setValue("charity_phone_number", value); 
    trigger("charity_phone_number");
  };

  const handleContactPhoneChange = (value: string) => {
    setPhoneNumber(""); 
    setValue("contact_phone_number", value); 
    trigger("contact_phone_number");
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
    setValue("is_approved", !isAgreed); 
    trigger("is_approved");
  };

  

  const onSubmit = (data: CharityFormData) => {
    console.log("Submitting Charity Data:", data);
    sendCharity(data)
      .then((response) => {
        console.log(response);
        console.log("Charity data submitted successfully");
        // Clear form fields
        Object.keys(data).forEach((key) => setValue(key as keyof CharityFormData, ""));
        setIsAgreed(false); // Reset agreement toggle
      })
      .catch((error) => {
        console.log(error);
        console.log("Error submitting charity data");
      });
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
        <h1>Charity Info</h1>
        <div className="grid grid-cols-1 gap-x-8 gap-y-6 ">
          <div>
          <label htmlFor="charityname" className="label-style"> Charity Name</label>   
            <div className="mt-2.5">
              <input
                type="text"
                {...register("charity_name")}
                id="charity-name"
                // autoComplete="given-name"
                className="input-style"
              />
              {errors.charity_name && <p className="text-red-500">{errors.charity_name.message}</p>}
            </div>
          </div>
        </div>

        <div className="sm:col-span-2 grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
          <div>
            <label htmlFor="charity-email" className="label-style">Charity Email</label>
            <div className="mt-2.5">
              <input
          type="email"
          {...register("charity_email")}
          id="charity-email"
          className="input-style"
              />
              {errors.charity_email && <p className="text-red-500">{errors.charity_email.message}</p>}
            </div>
          </div>

          <div>
            <label htmlFor="charity-phone-number" className="label-style">Charity Phone Number</label>
            <div className="mt-2.5">
              <div className="flex rounded-md border border-gray-300 bg-white focus-within:ring-2 focus-within:ring-blue-600 focus-within:ring-offset-2">
          <PhoneInput
            country={userCountry}
            value={phoneNumber}
            onChange={handleCharityPhoneChange}
            inputStyle={{
              width: "100%",
              height: "40px",
              borderRadius: "5px",
              border: "1px solid #ccc",
              paddingLeft: "50px",
            }}
          />
              </div>
              {errors.charity_phone_number && <p className="text-red-500">{errors.charity_phone_number.message}</p>}
            </div>
          </div>
        </div>
        


        <h1>Contact Info</h1>

        <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
          <div>
            <label htmlFor="contact-first-name" className="label-style"> Contact First name</label>   
            <div className="mt-2.5">
              <input
                type="text"
                {...register("contact_first_name")}
                id="contact-first-name"
                autoComplete="given-name"
                className="input-style"
              />
              {errors.contact_first_name && <p className="text-red-500">{errors.contact_first_name.message}</p>}
            </div>
          </div>
          
          <div>
            <label htmlFor="contact-last-name" className="label-style">Contact Last name</label>
            <div className="mt-2.5">
              <input
                type="text"
                {...register("contact_last_name")}
                id="contact-last-name"
                autoComplete="family-name"
                className="input-style"
              />
               {errors.contact_last_name && <p className="text-red-500">{errors.contact_last_name.message}</p>}
            </div>
          </div>
          
            <div className="sm:col-span-2 grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
            <div>
              <label htmlFor="contact-email" className="label-style"> Contact Email </label>
              <div className="mt-2.5">
              <input
                type="contact-email"
                {...register("contact_email")}
                id="contact-email"
                autoComplete="contact-email"
                className="input-style"
              />
              {errors.contact_email && <p className="text-red-500">{errors.contact_email.message}</p>}
              </div>
            </div>
            
            <div>
              <label htmlFor="contact-phone-number" className="label-style">Contact Phone umber</label>
              <div className="mt-2.5">
              <div className="flex rounded-md border border-gray-300 bg-white focus-within:ring-2 focus-within:ring-blue-600 focus-within:ring-offset-2">
                <PhoneInput
                country={userCountry}
                value={phoneNumber}
                onChange={handleContactPhoneChange}
                inputStyle={{
                  width: "100%",
                  height: "40px",
                  borderRadius: "5px",
                  border: "1px solid #ccc",
                  paddingLeft: "50px",
                }}
                />
              </div>
              {errors.contact_phone_number && <p className="text-red-500">{errors.contact_phone_number.message}</p>}
              </div>
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
              <Link href="/privacy-policy" className="font-semibold text-blue-600">
                privacy&nbsp;policy
              </Link>
              .
            </label>
          </div>
          {errors.is_approved && <p className="text-red-500">{errors.is_approved.message}</p>}
        </div>
        
        <div className="mt-10">
          <button
            type="submit"
            disabled={!isValid}
            onClick={handleSubmit(onSubmit)}
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
