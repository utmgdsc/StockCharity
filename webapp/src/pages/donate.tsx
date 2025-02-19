import { JSX } from "react";

const Donate = (): JSX.Element => (
  <>
  <div className="text-center my-8"><h1>Donate</h1></div>
      <form action="#" method="POST" className="mx-auto w-full max-w-lg sm:mt-0">
        <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
          
          <div className="sm:col-span-2">
            <label htmlFor="email" className="label-style">Email</label>
            <input id="email" type="email" name="email" autoComplete="email" className="input-style" placeholder="Email" required />
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="card-number" className="label-style">Card Number</label>
            <input id="card-number" type="number" name="card-number" autoComplete="cc-number" className="input-style" placeholder="Card Number" required />
          </div>

          <div className="flex gap-x-2 sm:col-span-2">
            <div className="w-1/2">
              <label htmlFor="expiry-date" className="label-style">Expiry Date</label>
              <input id="expiry-date" type="date" name="expiry-date" autoComplete="cc-exp" className="input-style" required />
            </div>
            <div className="w-1/2">
              <label htmlFor="cvc" className="label-style">CVC</label>
              <input id="cvc" type="number" name="cvc" autoComplete="cc-csc" className="input-style" placeholder="CVC" required />
            </div>
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="name" className="label-style">Cardholder Name</label>
            <input id="name" type="text" name="name" autoComplete="cc-name" className="input-style" placeholder="Full Name" required />
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="country" className="label-style">Country</label>
            <input id="country" type="text" name="country" autoComplete="country-name" className="input-style" placeholder="Country" required />
          </div>
        </div>

        {/* Submit Button */}
        <div className="mt-6">
          <button type="submit" className="btn-primary w-full px-4 py-2.5 text-sm font-semibold text-white shadow-sm">
            Pay Now
          </button>
        </div>
      </form>
  </>
);

export default Donate;
