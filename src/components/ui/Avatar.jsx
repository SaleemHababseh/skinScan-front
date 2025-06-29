import React from 'react';
import { cn } from '../../utils/cn';
import { User } from 'lucide-react';

const Avatar = ({ 
  src, 
  alt, 
  fallback,
  size = 'md',
  className,
  ...props 
}) => {

  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-14 w-14',
    xl: 'h-20 w-20',
  };
  

  return (
    <div 
      className={cn(
        'relative flex shrink-0 overflow-hidden rounded-full bg-neutral-100',
        sizeClasses[size],
        className
      )}
      {...props}
    >
      { src ? (
        <img
          src={src}
          alt={alt || 'Avatar'}
          className="h-full w-full object-cover"
        />
      ) : fallback ? (
        <div className="flex h-full w-full items-center justify-center rounded-full bg-neutral-200 text-neutral-500">
          {fallback}
        </div>
      ) : (
        <div className="flex h-full w-full items-center justify-center rounded-full bg-neutral-200 text-neutral-500">
          <User className="h-[60%] w-[60%]" />
        </div>
      )}
    </div>
  );
};

export default Avatar;