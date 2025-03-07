import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin } from 'lucide-react';
import { trackSearch } from '../lib/analytics';

interface SearchBarProps {
  className?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ className = '' }) => {
  const [keyword, setKeyword] = useState('');
  const [location, setLocation] = useState('');
  const [radius, setRadius] = useState('10');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Track search event
    if (keyword || location) {
      trackSearch(keyword || location, location ? 'location' : 'keyword');
    }
    
    // If only location is provided, navigate to city page
    if (!keyword && location) {
      const citySlug = location.toLowerCase().replace(/\s+/g, '-');
      navigate(`/soft-play/${citySlug}`);
      return;
    }
    
    // Otherwise, use search page with params
    const params = new URLSearchParams();
    if (keyword) params.append('keyword', keyword);
    if (location) params.append('location', location);
    if (radius) params.append('radius', radius);
    
    navigate(`/search?${params.toString()}`);
  };

  return (
    <form onSubmit={handleSubmit} className={`${className} w-full max-w-full`}>
      <div className="flex flex-col md:flex-row bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="flex-1 flex items-center border-b md:border-b-0 md:border-r border-gray-200">
          <Search className="ml-4 h-5 w-5 text-gray-400 flex-shrink-0" />
          <input
            type="text"
            placeholder="Search for soft play areas..."
            className="w-full p-4 focus:outline-none"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
        </div>
        <div className="flex-1 flex items-center border-b md:border-b-0 md:border-r border-gray-200">
          <MapPin className="ml-4 h-5 w-5 text-gray-400 flex-shrink-0" />
          <input
            type="text"
            placeholder="City or Postcode"
            className="w-full p-4 focus:outline-none"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>
        <div className="flex items-center border-b md:border-b-0 md:border-r border-gray-200">
          <select
            value={radius}
            onChange={(e) => setRadius(e.target.value)}
            className="w-32 p-4 focus:outline-none bg-transparent"
          >
            <option value="5">5 miles</option>
            <option value="10">10 miles</option>
            <option value="20">20 miles</option>
            <option value="50">50 miles</option>
          </select>
        </div>
        <button
          type="submit"
          className="bg-pink-500 hover:bg-pink-600 text-white font-bold py-4 px-8 transition duration-200 whitespace-nowrap"
        >
          Search
        </button>
      </div>
    </form>
  );
};

export default SearchBar;