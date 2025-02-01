import React from 'react';
import { useRouter } from 'next/router';

interface ButtonProps {
  children: string; // Only allow text
  onClick?: () => void; // Optional
  className?: string; // Optional, will override default style
  route?: string; // Optional re-routing
}

export function Button({ children, onClick, className = "", route }: ButtonProps) {
  const router = useRouter();

  const handleClick = () => {
    if (onClick) onClick(); // Execute custom logic, if provided
    if (route) router.push(route); // Navigate to the route, if specified
  };

  return (
    <button
      onClick={handleClick}
      className={`bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 ${className}`}
    >
      {children}
    </button>
  );
}