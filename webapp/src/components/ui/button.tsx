import React from 'react';
import { useRouter } from 'next/router';

interface ButtonProps {
  children: string; // Only allow text
  onClick?: () => void; // Optional
  className?: string; // Optional, will override default style
  route?: string; // Optional re-routing
}

export function Button({ children, onClick, className = "btn-primary", route }: ButtonProps) {
  const router = useRouter();

  const handleClick = () => {
    if (onClick) onClick(); // Execute custom logic, if provided
    if (route) router.push(route); // Navigate to the route, if specified
  };

  return (
    <button
      onClick={handleClick}
      className={`btn-primary ${className}`}
    >
      {children}
    </button>
  );
}