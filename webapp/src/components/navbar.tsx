import React from 'react';
import Link from 'next/link';

const NavBar: React.FC = () => {
    return (
        <nav className="flex justify-around items-center bg-gray-800 text-white">
            <div className="flex gap-4 py-2">
                <Link href="/" className="hover:underline">Home</Link>
            </div>

            <div className="flex gap-4 py-2">
                <Link href="/Donate" className="hover:underline">Donate</Link>
            </div>

            <div className="flex gap-4 py-2">
                <Link href="/Account" className="hover:underline">Account</Link>
            </div>

            <div className="text-xl font-bold">
                Stock Charity
            </div>

            <div className="flex gap-4 py-2">
                <Link href="/AboutUs" className="hover:underline">About</Link>
            </div>

            <div className="flex gap-4 py-2">
                <Link href="/charity-signup" className="hover:underline">Join as a Charity</Link>
            </div>
            
            <div className="flex gap-4 py-2">
                <Link href="/login" className="hover:underline bg-green-500 text-white px-4 py-2 rounded-full">Login</Link>
            </div>
        </nav>
    );
};

export default NavBar;
