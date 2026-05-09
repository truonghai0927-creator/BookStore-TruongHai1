import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
}

export default function Card({ children, className = '', hover = false, onClick }: CardProps) {
  return (
    <div
      className={`
        bg-white rounded-xl overflow-hidden shadow-md transition-all duration-300
        ${hover ? 'hover:shadow-lg hover:scale-[1.02] cursor-pointer' : ''}
        ${className}
      `}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

export function CardImage({ src, alt, fill }: { src: string; alt: string; fill?: boolean }) {
  return (
    <div className="relative h-48 overflow-hidden bg-gray-100">
      {fill ? (
        <img src={src} alt={alt} className="w-full h-full object-cover" />
      ) : (
        <img src={src} alt={alt} className="w-full h-full object-cover" />
      )}
    </div>
  );
}

export function CardContent({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`p-4 ${className}`}>{children}</div>;
}