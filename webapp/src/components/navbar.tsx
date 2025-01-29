import React from 'react';

const NavBar: React.FC = () => {
    return (
        <nav className="flex justify-around items-center bg-gray-800 text-white">
            <div className="flex gap-4 py-2">
                <a href="#HomePage" className="hover:underline">Home</a>
            </div>

            <div className="flex gap-4 py-2">
                <a href="#Donate" className="hover:underline">Donate</a>
            </div>

            <div className="flex gap-4 py-2">
                <a href="#Account" className="hover:underline">Account</a>
            </div>

            <div className="text-xl font-bold">
                Stock Charity
            </div>

            <div className="flex gap-4 py-2">
                <a href="#AboutUs" className="hover:underline">About</a>
            </div>

            <div className="flex gap-4 py-2">
                <a href="#charity-signup" className="hover:underline">Join as a Charity</a>
            </div>
            
            <div className="flex gap-4 py-2">
                <a href="#login" className="hover:underline bg-green-500 text-white px-4 py-2 rounded-full">Login</a>
            </div>
        </nav>
    );
};

export default NavBar;
