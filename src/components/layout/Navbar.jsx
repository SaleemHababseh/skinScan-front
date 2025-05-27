import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, LogOut, User, Settings } from 'lucide-react';
import { cn } from '../../utils/cn';
import ThemeToggle from '../ui/ThemeToggle';
import useAuthStore from '../../store/auth-store';
import Button from '../ui/Button';
import Avatar from '../ui/Avatar';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const { user, isAuthenticated, logout } = useAuthStore();
  const [isUserMenuOpen, setIsUserMenuOpen] = React.useState(false);
  const userMenuRef = React.useRef(null);
  const navigate = useNavigate();
  
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };
  
  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };
  
  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };
  
  // Close user menu when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  const getNavLinks = () => {
    const commonLinks = [
      { name: 'Home', href: '/' },
      { name: 'About', href: '/about' },
    ];
    
    if (!isAuthenticated) {
      return [...commonLinks];
    }
    
    if (user?.role === 'patient') {
      return [
        ...commonLinks,
        { name: 'Dashboard', href: '/patient/dashboard' },
        { name: 'Diagnoses', href: '/patient/diagnoses' },
        { name: 'Appointments', href: '/patient/appointments' },
        { name: 'News', href: '/news' },
      ];
    }
    
    if (user?.role === 'doctor') {
      return [
        ...commonLinks,
        { name: 'Dashboard', href: '/doctor/dashboard' },
        { name: 'Patients', href: '/doctor/patients' },
        { name: 'Appointments', href: '/doctor/appointments' },
      ];
    }
    
    if (user?.role === 'admin') {
      return [
        ...commonLinks,
        { name: 'Dashboard', href: '/admin/dashboard' },
        { name: 'Users', href: '/admin/users' },
        { name: 'Reports', href: '/admin/reports' },
      ];
    }
    
    return commonLinks;
  };
  
  const navLinks = getNavLinks();
  
  return (
    <header className="sticky top-0 z-50 w-full bg-white shadow-sm dark:bg-neutral-900 dark:border-b dark:border-neutral-800">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-primary">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-5 w-5 text-white" 
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <path d="M6 11a4 4 0 0 1 4-4c2 0 4 3 8 3a4 4 0 0 0 4-4" />
              <path d="M6 21a4 4 0 0 1 4-4c2 0 4 3 8 3a4 4 0 0 0 4-4" />
            </svg>
          </div>
          <span className="text-xl font-bold">Skin<span className="text-primary-500">Scan</span></span>
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <ul className="flex space-x-6">
            {navLinks.map((link) => (
              <li key={link.name}>
                <Link 
                  to={link.href}
                  className="text-neutral-700 hover:text-primary-500 dark:text-neutral-300 dark:hover:text-primary-400"
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        
        {/* Right side section */}
        <div className="flex items-center space-x-4">
          <ThemeToggle />
          
          {isAuthenticated ? (
            <div className="relative" ref={userMenuRef}>
              <button
                className="flex items-center space-x-1 rounded-full focus:outline-none"
                onClick={toggleUserMenu}
              >
                <Avatar 
                  src={user.profileImage} 
                  alt={`${user.firstName} ${user.lastName}`}
                  size="sm"
                />
              </button>
              
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 dark:bg-neutral-800 dark:ring-neutral-700">
                  <div className="border-b border-neutral-200 px-4 py-2 dark:border-neutral-700">
                    <p className="text-sm font-medium">{user.firstName} {user.lastName}</p>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">{user.email}</p>
                  </div>
                  <Link
                    to="/profile"
                    className="flex w-full items-center px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-700"
                  >
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </Link>
                  <Link
                    to="/settings"
                    className="flex w-full items-center px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-700"
                  >
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-700"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Link to="/login">
                <Button variant="outline" size="sm">
                  Log In
                </Button>
              </Link>
              <Link to="/register">
                <Button size="sm">
                  Sign Up
                </Button>
              </Link>
            </div>
          )}
          
          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-md p-2 text-neutral-700 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800"
              onClick={toggleMobileMenu}
            >
              <span className="sr-only">Open main menu</span>
              {isMobileMenuOpen ? (
                <X className="block h-6 w-6" />
              ) : (
                <Menu className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu, show/hide based on menu state */}
      <div className={cn(
        'md:hidden',
        isMobileMenuOpen ? 'block' : 'hidden'
      )}>
        <div className="space-y-1 px-4 py-3 sm:px-6">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.href}
              className="block py-2 text-base font-medium text-neutral-700 hover:text-primary-500 dark:text-neutral-300 dark:hover:text-primary-400"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {link.name}
            </Link>
          ))}
          
          {!isAuthenticated && (
            <div className="mt-4 flex flex-col space-y-2">
              <Link to="/login">
                <Button variant="outline" className="w-full">
                  Log In
                </Button>
              </Link>
              <Link to="/register">
                <Button className="w-full">
                  Sign Up
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;