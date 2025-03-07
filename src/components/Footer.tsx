import React from 'react';
import { Link } from 'react-router-dom';
import { Play as Playground, Facebook, Twitter, Instagram, Mail } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <Playground className="h-8 w-8 text-pink-500" />
              <span className="text-2xl font-bold">My Local <span className="text-pink-500">Soft Play</span></span>
            </Link>
            <p className="text-gray-300">
              Helping families find the best soft play areas across the UK.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-300 hover:text-pink-400">Home</Link></li>
              <li><Link to="/search" className="text-gray-300 hover:text-pink-400">Find Soft Play</Link></li>
              <li><Link to="/about" className="text-gray-300 hover:text-pink-400">About Us</Link></li>
              <li><Link to="/contact" className="text-gray-300 hover:text-pink-400">Contact</Link></li>
              <li><Link to="/soft-play-near-me" className="text-gray-300 hover:text-pink-400">Soft Play Near Me</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Popular Locations</h3>
            <ul className="space-y-2">
              <li><Link to="/soft-play/london" className="text-gray-300 hover:text-pink-400">London</Link></li>
              <li><Link to="/soft-play/manchester" className="text-gray-300 hover:text-pink-400">Manchester</Link></li>
              <li><Link to="/soft-play/birmingham" className="text-gray-300 hover:text-pink-400">Birmingham</Link></li>
              <li><Link to="/soft-play/edinburgh" className="text-gray-300 hover:text-pink-400">Edinburgh</Link></li>
              <li><Link to="/soft-play/glasgow" className="text-gray-300 hover:text-pink-400">Glasgow</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Connect With Us</h3>
            <div className="flex space-x-4 mb-4">
              <a href="#" className="text-gray-300 hover:text-pink-400">
                <Facebook className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-300 hover:text-pink-400">
                <Twitter className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-300 hover:text-pink-400">
                <Instagram className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-300 hover:text-pink-400">
                <Mail className="h-6 w-6" />
              </a>
            </div>
            <p className="text-gray-300">
              Sign up for our newsletter to get the latest updates.
            </p>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} My Local Soft Play. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;