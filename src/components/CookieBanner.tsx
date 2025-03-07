import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';
import { X } from 'lucide-react';

const CookieBanner: React.FC = () => {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Check if user has already accepted cookies
    const cookieConsent = Cookies.get('cookie-consent');
    if (!cookieConsent) {
      setShowBanner(true);
    }
  }, []);

  const acceptCookies = () => {
    // Set cookie consent for 1 year
    Cookies.set('cookie-consent', 'accepted', { expires: 365 });
    setShowBanner(false);
  };

  const declineCookies = () => {
    // Set cookie consent as declined
    Cookies.set('cookie-consent', 'declined', { expires: 365 });
    setShowBanner(false);
    
    // Disable Google Analytics tracking
    window['ga-disable-G-XXXXXXXXXX'] = true;
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex-1">
            <p className="text-gray-700 text-sm md:text-base">
              We use cookies and similar technologies to enhance your experience and analyze site traffic. This includes essential cookies for site functionality and analytics cookies to help us improve our services. By continuing to visit this site you agree to our use of cookies.{' '}
              <Link to="/privacy-policy" className="text-pink-500 hover:text-pink-600 underline">
                Learn more
              </Link>
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={declineCookies}
              className="text-gray-600 hover:text-gray-800 text-sm font-medium"
            >
              Decline
            </button>
            <button
              onClick={acceptCookies}
              className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded text-sm font-medium"
            >
              Accept Cookies
            </button>
            <button
              onClick={declineCookies}
              className="text-gray-400 hover:text-gray-600 md:hidden"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookieBanner;