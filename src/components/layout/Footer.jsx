import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Shield, Phone, Mail } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">              <div className="w-8 h-8">
                <img src="/logo.jpg" alt="SkinScan Logo" className="h-full w-full" />
              </div>
              <span className="text-xl font-bold text-gray-900">
                SkinScan
              </span>
            </div>
            <p className="text-gray-600 max-w-md">
              Advanced skin health monitoring and analysis platform connecting patients with healthcare professionals for better dermatological care.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  to="/about" 
                  className="text-gray-600 hover:text-primary-600 transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link 
                  to="/contact" 
                  className="text-gray-600 hover:text-primary-600 transition-colors"
                >
                  Contact
                </Link>
              </li>
              
              <li>
                <Link 
                  to="/news" 
                  className="text-gray-600 hover:text-primary-600 transition-colors"
                >
                  Health News
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
              Support
            </h3>
            <ul className="space-y-2">
              <li className="flex items-center space-x-2 text-gray-600">
                <Phone className="w-4 h-4" />
                <span>24/7 Support</span>
              </li>
              <li className="flex items-center space-x-2 text-gray-600">
                <Mail className="w-4 h-4" />
                <span>Emergency Care</span>
              </li>
              <li className="flex items-center space-x-2 text-gray-600">
                <Shield className="w-4 h-4" />
                <span>Privacy Protected</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-8 pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm">
              © {currentYear} SkinScan. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a 
                href="#" 
                className="text-gray-500 hover:text-primary-600 text-sm transition-colors"
              >
                Privacy Policy
              </a>
              <a 
                href="#" 
                className="text-gray-500 hover:text-primary-600 text-sm transition-colors"
              >
                Terms of Service
              </a>
              <a 
                href="#" 
                className="text-gray-500 hover:text-primary-600 text-sm transition-colors"
              >
                Medical Disclaimer
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;