import React from 'react';
import { cn } from '../../utils/cn';

const Card = ({ 
  children, 
  className, 
  hoverEffect = false,
  ...props 
}) => {
  return (
    <div 
      className={cn(
        'card rounded-xl bg-white p-6 shadow-md transition-all
        hoverEffect && 'hover:shadow-lg hover:-translate-y-1 cursor-pointer',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

const CardHeader = ({ 
  children, 
  className, 
  ...props 
}) => {
  return (
    <div 
      className={cn('mb-4 flex flex-col space-y-1.5', className)}
      {...props}
    >
      {children}
    </div>
  );
};

const CardTitle = ({ 
  children, 
  className, 
  ...props 
}) => {
  return (
    <h3 
      className={cn('text-xl font-semibold leading-none tracking-tight', className)}
      {...props}
    >
      {children}
    </h3>
  );
};

const CardDescription = ({ 
  children, 
  className, 
  ...props 
}) => {
  return (
    <p 
      className={cn('text-sm text-neutral-600 className)}
      {...props}
    >
      {children}
    </p>
  );
};

const CardContent = ({ 
  children, 
  className, 
  ...props 
}) => {
  return (
    <div 
      className={cn('', className)}
      {...props}
    >
      {children}
    </div>
  );
};

const CardFooter = ({ 
  children, 
  className, 
  ...props 
}) => {
  return (
    <div 
      className={cn('mt-4 flex items-center pt-2', className)}
      {...props}
    >
      {children}
    </div>
  );
};

Card.Header = CardHeader;
Card.Title = CardTitle;
Card.Description = CardDescription;
Card.Content = CardContent;
Card.Footer = CardFooter;

export default Card;