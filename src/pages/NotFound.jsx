import React from 'react';
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';
import Button from '../components/ui/Button';

const NotFound = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 text-center">
      <div className="mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-neutral-100 dark:bg-neutral-800">
        <span className="text-4xl font-bold text-neutral-400 dark:text-neutral-500">404</span>
      </div>
      <h1 className="mb-2 text-3xl font-bold text-neutral-900 dark:text-neutral-100">Page Not Found</h1>
      <p className="mb-6 max-w-md text-neutral-600 dark:text-neutral-400">
        The page you are looking for doesn't exist or has been moved.
      </p>
      <Link to="/">
        <Button className="flex items-center">
          <Home className="mr-2 h-4 w-4" />
          Back to Home
        </Button>
      </Link>
    </div>
  );
};

export default NotFound;