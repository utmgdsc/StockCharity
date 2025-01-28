import React from 'react';

const NavBar: React.FC = () => {
    return (
        <nav className="flex justify-around items-center p-4 bg-gray-800 text-white">
            <div className="flex gap-4">
                <a href="#home" className="hover:underline">Home</a>
            </div>

            <div className="flex gap-4">
                <a href="#donate" className="hover:underline">Donate</a>
            </div>

            <div className="flex gap-4">
                <a href="#account" className="hover:underline">Account</a>
            </div>

            <div className="text-xl font-bold">
                Stock Charity
            </div>

            <div className="flex gap-4">
                <a href="#about" className="hover:underline">About</a>
            </div>

            <div className="flex gap-4">
                <a href="#join" className="hover:underline">Join as a Charity</a>
            </div>
            
            <div className="flex gap-4">
                <a href="#login" className="hover:underline bg-green-500 text-white px-4 py-2 rounded-full">Login</a>
            </div>
        </nav>
    );
};

export default NavBar;
