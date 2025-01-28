import React, { ReactNode } from 'react';

interface CardProps {
  children: ReactNode; // any valid React children
  className?: string;
}

export function Card({ children, className = "" }: CardProps) {
  console.log("Card component rendered with className:", className);
  return (
    <div className={`bg-white rounded-lg shadow-md ${className}`}>
      {children}
    </div>
  );
}

export function CardContent({ children, className = "" }: CardProps) {
  console.log("CardContent component rendered with className:", className);
  return (
    <div className={`p-4 ${className}`}>
      {children}
    </div>
  );
}