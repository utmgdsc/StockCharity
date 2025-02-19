import React from "react";
import { useState } from "react";

const CharitySignUp: React.FC = () => {
  const [isAgreed, setIsAgreed] = useState(false);

  const toggleAgreement = () => {
    setIsAgreed(!isAgreed);
  };

  return (
    <div className="grid grid-cols-2 relative isolate bg-white px-6 py-24 sm:py-32 lg:px-8">
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
            <label
              htmlFor="first-name"
              className="label-style"              >
              First name
            </label>
            <div className="mt-2.5">
              <input
                type="text"
                name="first-name"
                id="first-name"
                autoComplete="given-name"
                className="input-style"
              />
            </div>
          </div>
          <div>
            <label
              htmlFor="last-name"
              className="label-style"
              >
              Last name
            </label>
            <div className="mt-2.5">
              <input
                type="text"
                name="last-name"
                id="last-name"
                autoComplete="family-name"
                className="input-style"
              />
            </div>
          </div>
          <div className="sm:col-span-2">
            <label
              htmlFor="company"
              className="label-style"
              >
              Charity Name
            </label>
            <div className="mt-2.5">
              <input
                type="text"
                name="company"
                id="company"
                autoComplete="organization"
                className="input-style"
              />
            </div>
          </div>
          <div className="sm:col-span-2">
            <label
              htmlFor="email"
              className="label-style"
              >
              Email
            </label>
            <div className="mt-2.5">
              <input
                type="email"
                name="email"
                id="email"
                autoComplete="email"
                className="input-style"
              />
            </div>
          </div>
          <div className="sm:col-span-2">
            <label
              htmlFor="phone-number"
              className="label-style"
              >
              Phone number
            </label>
            <div className="mt-2.5">
              <div className="flex rounded-md border border-gray-300 bg-white focus-within:ring-2 focus-within:ring-cyan-600 focus-within:ring-offset-2">
                <select
                  id="country"
                  name="country"
                  autoComplete="country"
                  aria-label="Country"
                  className="block w-20 rounded-l-md border-r border-gray-300 bg-white px-3 py-2 text-gray-900 focus:outline-none"
                >
                  <option>US</option>
                  <option>CA</option>
                  <option>EU</option>
                </select>
                <input
                  type="text"
                  name="phone-number"
                  id="phone-number"
                  className="block w-full rounded-r-md px-3 py-2 text-gray-900 placeholder-gray-400 focus:outline-none"
                  placeholder="123-456-7890"
                />
              </div>
            </div>
          </div>
          <div className="sm:col-span-2">
            <label
              htmlFor="message"
              className="label-style"
              >
              Message
            </label>
            <div className="mt-2.5">
              <textarea
                name="message"
                id="message"
                rows={4}
                className="input-style"
              ></textarea>
            </div>
          </div>

          {/* Privacy Agreement Section */}
          <div className="flex items-center gap-x-4 sm:col-span-2">

            {/* Small toggle button */}
            <button
              type="button"
              className={`relative flex w-8 h-4 cursor-pointer rounded-full ${
                isAgreed ? "bg-cyan-600" : "bg-gray-200"
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

            {/* Agreement text */}
            <label className="text-sm text-gray-600">
              By selecting this, you agree to our{" "}
              <a href="#" className="font-semibold text-cyan-600">
                privacy&nbsp;policy
              </a>
              .
            </label>
          </div>

        </div>
        <div className="mt-10">
          <button
            type="submit"
            className="btn-primary px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default CharitySignUp;
