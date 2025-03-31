import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
}

function Card({ children, className }: CardProps) {
  return (
    <div className={`p-6 bg-white rounded-lg border shadow-sm ${className}`}>
      {children}
    </div>
  );
}

export default Card;
