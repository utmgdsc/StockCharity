import React, { ReactNode } from 'react';

interface CardProps {
  children: ReactNode; // any valid React children
  className?: string;
}

export function Card({ children, className = "" }: CardProps) {
  return (
    <div className={`card-grey ${className}`}>
      {children}
    </div>
  );
}

export function CardContent({ children, className = "" }: CardProps) {
  return (
    <div className={`p-4 ${className}`}>
      {children}
    </div>
  );
}