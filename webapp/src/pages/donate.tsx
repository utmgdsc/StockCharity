import { JSX } from "react";

const Donate = (): JSX.Element => (
  <>
    <h1>Donate</h1>
    <form className="flex flex-col gap-2">
      {/* Placeholder form until we try to integrate with stripe */}
      <label htmlFor="email">Email</label>
      <input id="email" type="email" placeholder="Email" />
      <label htmlFor="card-number">Card Number</label>
      <input id="card-number" type="number" placeholder="Card Number" />
      <div className="flex flex-row gap-x-2">
        <input className="grow" type="date" />
        <input className="grow" type="number" placeholder="CVC" />
      </div>
      <label htmlFor="name">Cardholder Name</label>
      <input id="name" type="text" placeholder="Name" />
      <label htmlFor="country">Country</label>
      <input id="country" type="text" placeholder="Country" />
      <div className="flex gap-x-2 m-auto">
          <input id="terms" type="checkbox" />
          <label htmlFor="terms">I agree to the terms and conditions</label>
      </div>
      <input type="submit" value="Pay"/>
    </form>
  </>
);

export default Donate;
