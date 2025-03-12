import Link from "next/link";

const Footer = () => {
    return (
      <footer className="bg-white rounded-lg shadow-sm m-4 dark:bg-blue-500">
        <div className="w-full mx-auto max-w-screen-xl p-4 md:flex md:items-center md:justify-between">
          <span className="text-sm text-white sm:text-center dark:text-white">
            © {new Date().getFullYear()} <Link href="https://stockcharity.com/" className="hover:underline">Stock Charity</Link>. All Rights Reserved.
          </span>
          <ul className="flex flex-wrap items-center mt-3 text-sm font-medium text-gray-500 dark:text-white sm:mt-0">
            <li>
              <Link href="/about-us" className="hover:underline me-4 md:me-6">About Us</Link>
            </li>
            <li>
              <Link href="/privacy-policy" className="hover:underline me-4 md:me-6">Privacy Policy</Link>
            </li>
            <li>
              <Link href="/terms-and-conditions" className="hover:underline me-4 md:me-6">Terms and Conditions</Link>
            </li>
            <li>
              <Link href="#" className="hover:underline">Contact Us</Link>
            </li>
          </ul>
        </div>
      </footer>
    );
  };
  
  export default Footer;