import { JSX } from "react"; 
import Image from "next/image";

const AboutUs = (): JSX.Element => (
<div className="font-sans">

      {/* Title */}
      <section className="flex flex-col lg:flex-row items-center justify-center min-h-screen bg-gray-100 p-8">
      {/* Left Column - Image */}
        <div className="w-full h-full lg:w-1/2 flex justify-center">
          <Image 
            src="/photos/stockphotoforstockcharity.jpeg" 
            alt="Sample Image" 
            width={800}
            height={500}
            className="max-w-full h-auto rounded-lg shadow-lg"
          />
        </div>

        {/* Right Column - Header & Text */}
        <div className="w-full lg:w-1/2 p-6 text-center lg:text-left">
          <h1 className="text-4xl font-bold text-gray-900">Who We Are</h1>
          <p className="mt-4 text-lg text-gray-700">
            Explore the world of sustainable giving and make a lasting impact.  
            We&apos;re the whatever doing something for different charities to get whatever. Our mission is simple: whatever. 
          </p>
        </div>
      </section>
      
      <div className="text-center my-8">
        <h2>Frequently Asked Questions</h2>
      </div>

      <div className="join join-vertical w-full">
        <div className="collapse collapse-arrow join-item border-base-300 border">
          <input type="radio" name="my-accordion-4" defaultChecked />
          <div className="collapse-title text-xl font-medium">Which Stocks do we Invest In?</div>
          <div className="collapse-content">
            <p>hello</p>
          </div>
        </div>
        <div className="collapse collapse-arrow join-item border-base-300 border">
          <input type="radio" name="my-accordion-4" />
          <div className="collapse-title text-xl font-medium">How does our application work?</div>
          <div className="collapse-content">
            <p>hello</p>
          </div>
        </div>
        <div className="collapse collapse-arrow join-item border-base-300 border">
          <input type="radio" name="my-accordion-4" />
          <div className="collapse-title text-xl font-medium">Do we have any other FAQs?</div>
          <div className="collapse-content">
            <p>hello</p>
          </div>
        </div>
      </div>
  </div>
  );


export default AboutUs;
