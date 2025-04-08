import React from "react";
import Link from "next/link";

const TermsAndConditions = () => {
  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <h1 className="text-4xl font-bold text-center mb-6">Terms and Conditions</h1>
      <p className="text-gray-600 text-center mb-4">Last updated: March 10, 2025</p>
      <p className="mb-4">
        Please read these <u>terms and conditions</u> carefully before using our service.
      </p>

      <h2 className="text-2xl font-semibold mt-8">Interpretation and Definitions</h2>
      <h3 className="text-xl font-semibold mt-4">Interpretation</h3>
      <p className="mb-4">
        The underlined words have meanings defined
        under the following conditions. The following definitions shall have the
        same meaning regardless of whether they appear in singular or in plural.
      </p>

      <h3 className="text-xl font-semibold mt-4">Definitions</h3>
      <ul className="list-disc list-inside mb-4">
        <li><strong>Company:</strong> Stock Charity, 3359 Mississauga Rd, Mississauga, ON L5L 1C6.</li>
        <li><strong>service:</strong> The website <Link href="https://www.stockcharity.com" className="text-blue-500 hover:underline">www.stockcharity.com</Link>.</li>
        <li><strong>terms:</strong> These <u>terms and conditions</u> form the entire agreement between you and StockCharity.</li>
        <li><strong>you:</strong> The individual accessing or using the service.</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-8">Acknowledgment</h2>
      <p className="mb-4">
        These are the <u>terms and conditions</u> governing the use of this service and
        the agreement that operates between <u>you</u> and StockCharity. By accessing or
        using the service, <u>you</u> agree to be bound by these <u>terms</u>.
      </p>
      <p className="mb-4">If <u>you</u> disagree with any part of these <u>terms</u>, <u>you</u> may not access the service.</p>
      
      <h2 className="text-2xl font-semibold mt-8">Links to Other Websites</h2>
      <p className="mb-4">
        our service may contain links to third-party websites that are not owned or controlled by StockCharity.
        we have no control over, and assume no responsibility for, the content or policies of any third-party sites.
      </p>
      
      <h2 className="text-2xl font-semibold mt-8">Termination</h2>
      <p className="mb-4">
        We may terminate or suspend <u>your</u> access immediately, without prior notice or liability, for any reason,
        including if <u>you</u> breach these <u>terms</u>.
      </p>
      
      <h2 className="text-2xl font-semibold mt-8">Limitation of Liability</h2>
      <p className="mb-4">
        To the maximum extent permitted by applicable law, StockCharity shall not be liable for any incidental, indirect,
        or consequential damages resulting from the use of the service.
      </p>
      
      <h2 className="text-2xl font-semibold mt-8">Governing Law</h2>
      <p className="mb-4">
        The laws of Ontario, Canada, shall govern this <u>terms</u> and <u>your</u> use of the service.
      </p>
      
      <h2 className="text-2xl font-semibold mt-8">Changes to These Terms</h2>
      <p className="mb-4">
        We reserve the right to modify or replace these <u>terms</u> at any time. By continuing to access or use our service
        after the revisions become effective, <u>you</u> agree to be bound by the revised <u>terms</u>.
      </p>
      
      <h2 className="text-2xl font-semibold mt-8">Contact Us</h2>
      <p className="mb-4">If <u>you</u> have any questions about these <u>terms and conditions</u>, <u>you</u> can contact us:</p>
      <ul className="list-disc list-inside mb-4">
        <li>Email: <Link href="mailto:therealstockcharity@gmail.com" className="text-blue-500 hover:underline">stockcharity@gmail.com</Link></li>
      </ul>
    </div>
  );
};

export default TermsAndConditions;
