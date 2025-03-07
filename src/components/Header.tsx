import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Play as Playground, Menu, X } from 'lucide-react';

const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  // Add scroll listener for header shadow
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    // Add event listener
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Clean up
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <header className={`bg-white ${scrolled ? 'shadow-md' : ''} sticky top-0 z-50 transition-shadow duration-300`}>
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
          <Playground className="h-8 w-8 text-pink-500" />
          <span className="text-2xl font-bold text-gray-800">My Local <span className="text-pink-500">Soft Play</span></span>
        </Link>
        
        {/* Mobile menu button */}
        <button 
          className="md:hidden text-gray-600 focus:outline-none"
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
        
        {/* Desktop navigation */}
        <nav className="hidden md:block">
          <ul className="flex space-x-6">
            <li>
              <Link to="/" className="text-gray-600 hover:text-pink-500 font-medium">
                Home
              </Link>
            </li>
            <li>
              <Link to="/search" className="text-gray-600 hover:text-pink-500 font-medium">
                Find Soft Play
              </Link>
            </li>
            <li>
              <Link to="/about" className="text-gray-600 hover:text-pink-500 font-medium">
                About
              </Link>
            </li>
            <li>
              <Link to="/contact" className="text-gray-600 hover:text-pink-500 font-medium">
                Contact
              </Link>
            </li>
          </ul>
        </nav>
      </div>
      
      {/* Mobile navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100">
          <ul className="flex flex-col px-4 py-2">
            <li className="py-2 border-b border-gray-100">
              <Link 
                to="/" 
                className="block text-gray-600 hover:text-pink-500 font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>
            </li>
            <li className="py-2 border-b border-gray-100">
              <Link 
                to="/search" 
                className="block text-gray-600 hover:text-pink-500 font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Find Soft Play
              </Link>
            </li>
            <li className="py-2 border-b border-gray-100">
              <Link 
                to="/about" 
                className="block text-gray-600 hover:text-pink-500 font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                About
              </Link>
            </li>
            <li className="py-2">
              <Link 
                to="/contact" 
                className="block text-gray-600 hover:text-pink-500 font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Contact
              </Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
};

export default Header;