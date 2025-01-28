import React from 'react';

export function Card({ children, className = "" }) {
  console.log("Card component rendered with className:", className);
  return (
    <div className={`bg-white rounded-lg shadow-md ${className}`}>
      {children}
    </div>
  );
}

export function CardContent({ children, className = "" }) {
  console.log("CardContent component rendered with className:", className);
  return (
    <div className={`p-4 ${className}`}>
      {children}
    </div>
  );
}