import { JSX } from "react"; 

const AboutUs = (): JSX.Element => (
<div className="font-sans">

      {/* Title */}
      <div className="text-center my-8">
        <h1 className="text-3xl font-bold">About Us</h1>
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 px-12">
        <div className="bg-gray-100 p-4 rounded shadow">
          <h2 className="font-bold mb-2">What we do:</h2>
          <p>After we received your donations, we purchase your chosen stock and hold it*. Every month, we will donate the dividends to your preferred charity. 
            Now your favourite charity no longer has to worry about fluctuating donations!</p>
          <p><small>*Your stock may be sold and reinvested into a different stock if we determine that the stock is no longer suitable to hold (eg. significant decrease in value, no longer offering dividends).</small></p>
        </div>
        <div className="bg-gray-100 p-4 rounded shadow">
          <h2 className="font-bold mb-2">Which stocks do we invest in?</h2>
          <p>A stock</p>
          <p>B stock</p>
          <p>C stock</p>
          <p>...</p>
          <p>We choose stocks based off of price, dividend yield, and safety.</p>
        </div>
        <div className="bg-gray-100 p-4 rounded shadow">
          <h2 className="font-bold mb-2">Find us on other platforms!</h2>
          <p>Instagram: @stockcharity</p>
          <p>Email: questions@stockcharity.com</p>
        </div>
      </div>
    </div>
  );


export default AboutUs;
