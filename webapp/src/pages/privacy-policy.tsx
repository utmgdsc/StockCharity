import React from "react";
import Link from "next/link";

const PrivacyPolicy = () => {
  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <h1 className="text-4xl font-bold text-center mb-6">Privacy Policy</h1>
      <p className="text-gray-600 text-center mb-4">Last updated: March 10, 2025</p>
      <p className="mb-4">
        This <u>privacy policy</u> describes our policies and procedures on the
        collection, use, and disclosure of your information when you use the
        <u>service</u> and tells you about your privacy rights and how the law protects
        you.
      </p>
      <p className="mb-4">
        We use your Personal data to provide and improve the <u>service</u>. By using
        the <u>service</u>, you agree to the collection and use of information in
        accordance with this <u>privacy policy</u>.
      </p>
      <h2 className="text-2xl font-semibold mt-8">Interpretation and Definitions</h2>
      <h3 className="text-xl font-semibold mt-4">Interpretation</h3>
      <p className="mb-4">
        The words underlined have meanings
        defined under the following conditions. The following definitions shall
        have the same meaning regardless of whether they appear in singular or
        in plural.
      </p>
      <h3 className="text-xl font-semibold mt-4">Definitions</h3>
      <ul className="list-disc list-inside mb-4">
        <li>
          <strong>Account:</strong> A unique account created for you to access
          our <u>service</u>.
        </li>
        <li>
          <strong>Company:</strong> Refers to StockCharity, located at 3359
          Mississauga Rd, Mississauga, ON L5L 1C6.
        </li>
        <li>
          <strong>Cookies:</strong> Small files stored on your device that
          contain browsing details.
        </li>
        <li>
          <strong>Personal Data:</strong> Any information that relates to an
          identifiable individual.
        </li>
        <li>
          <strong><u>Service</u>:</strong> Refers to the Website: <Link href="https://www.stockcharity.com" className="text-blue-500 hover:underline">www.stockcharity.com</Link>
        </li>
        <li>
          <strong>You:</strong> The individual accessing or using the <u>service</u>.
        </li>
      </ul>
      <h2 className="text-2xl font-semibold mt-8">Collecting and using your <u>personal data</u></h2>
      <h3 className="text-xl font-semibold mt-4">Types of <u>data collected</u></h3>
      <h4 className="text-lg font-semibold mt-2">Personal Data</h4>
      <p className="mb-4">
        While using our <u>service</u>, we may ask you to provide us with certain
        personally identifiable information that can be used to contact or
        identify you, including:
      </p>
      <ul className="list-disc list-inside mb-4">
        <li>Email address</li>
        <li>First name and last name</li>
        <li>Phone number</li>
        <li>Address, State, Province, ZIP/Postal code, City</li>
        <li>Usage Data</li>
      </ul>
      <h3 className="text-xl font-semibold mt-4">Use of your <u>personal data</u></h3>
      <p className="mb-4">
        StockCharity may use <u>personal</u> data for the following purposes:
      </p>
      <ul className="list-disc list-inside mb-4">
        <li>To provide and maintain our <u>service</u>.</li>
        <li>To manage your account.</li>
        <li>To contact You with updates, security notices, or <u>service</u> changes.</li>
        <li>To analyze and improve user experience.</li>
      </ul>
      <h3 className="text-xl font-semibold mt-4">Security of your personal data</h3>
      <p className="mb-4">
        The security of your personal data is important to us, but no method of
        transmission over the Internet or method of electronic storage is 100%
        secure. While we strive to use commercially acceptable means to protect
        your <u>personal data</u>, we cannot guarantee its absolute security.
      </p>
      <h2 className="text-2xl font-semibold mt-8">Contact Us</h2>
      <p className="mb-4">
        If you have any questions about this <u>privacy policy</u>, you can contact us:
      </p>
      <ul className="list-disc list-inside mb-4">
        <li>Email: <Link href="mailto:therealstockcharity@gmail.com" className="text-blue-500 hover:underline">stockcharity@gmail.com</Link></li>
        <li>Website: <Link href="https://www.stockcharity.com" className="text-blue-500 hover:underline">www.stockcharity.com</Link></li>
      </ul>
    </div>
  );
};

export default PrivacyPolicy;
