import React from 'react';
import { Link } from 'react-router-dom';
import { Star, MapPin } from 'lucide-react';
import { Database } from '../types/supabase';
import { createExcerpt } from '../utils/formatDescription';

type Playground = Database['public']['Tables']['playgrounds']['Row'];

interface PlaygroundCardProps {
  playground: Playground;
}

const PlaygroundCard: React.FC<PlaygroundCardProps> = ({ playground }) => {
  const generateSlug = (name: string): string => {
    return name
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-');
  };

  const citySlug = playground.city.toLowerCase().replace(/\s+/g, '-');
  const nameSlug = generateSlug(playground.name);
  const descriptionExcerpt = createExcerpt(playground.description, 120);

  return (
    <Link to={`/soft-play/${citySlug}/${nameSlug}`} state={{ playground }} className="block">
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
        <div className="relative h-40 md:h-48">
          <img
            src={playground.image_url || 'https://images.unsplash.com/photo-1566454825481-9c31bd88c36f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60'}
            alt={playground.name}
            className="w-full h-full object-cover"
            loading="lazy"
            width="400"
            height="240"
          />
        </div>
        <div className="p-4">
          <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-2">{playground.name}</h3>
          
          <div className="flex items-center mb-2">
            <MapPin className="h-4 w-4 text-gray-500 mr-1" />
            <span className="text-gray-600 text-sm">{playground.city}, {playground.postcode}</span>
          </div>
          
          {playground.google_rating && (
            <div className="flex items-center mb-3">
              <Star className="h-4 w-4 text-yellow-400 mr-1" />
              <span className="text-gray-700 font-medium">{playground.google_rating}</span>
              <span className="text-gray-500 text-sm ml-1">({playground.google_reviews_count} reviews)</span>
            </div>
          )}
          
          <p className="text-gray-600 mb-3 line-clamp-2">{descriptionExcerpt}</p>
          
          {playground.features && playground.features.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {playground.features.slice(0, 3).map((feature, index) => (
                <span key={index} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                  {feature}
                </span>
              ))}
              {playground.features.length > 3 && (
                <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                  +{playground.features.length - 3} more
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default PlaygroundCard;