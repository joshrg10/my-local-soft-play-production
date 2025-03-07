import React, { useEffect, useState } from 'react';
import { supabase, fetchWithCache, mockPlaygrounds, safeSupabaseQuery } from '../lib/supabase';
import PlaygroundCard from './PlaygroundCard';
import { Database } from '../types/supabase';
import { Link } from 'react-router-dom';
import { MapPin, Star } from 'lucide-react';
import { createExcerpt } from '../utils/formatDescription';

type Playground = Database['public']['Tables']['playgrounds']['Row'];

const FeaturedPlaygrounds: React.FC = () => {
  const [playgrounds, setPlaygrounds] = useState<Playground[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [useMockData, setUseMockData] = useState(false);

  useEffect(() => {
    const fetchPlaygrounds = async () => {
      try {
        setLoading(true);
        
        try {
          const { data, error, usedFallback } = await safeSupabaseQuery(
            () => supabase
              .from('playgrounds')
              .select('id, name, city, postcode, image_url, google_rating, google_reviews_count, features, description')
              .limit(3),
            []
          );
            
          if (error && !usedFallback) throw error;
          
          if (data && data.length > 0) {
            setPlaygrounds(data);
            setUseMockData(usedFallback);
          } else {
            console.log('No data from Supabase, using mock data');
            setPlaygrounds(mockPlaygrounds as any);
            setUseMockData(true);
          }
        } catch (err) {
          console.error('Supabase request failed', err);
          setPlaygrounds(mockPlaygrounds as any);
          setUseMockData(true);
        }
      } catch (err) {
        console.error('Error fetching playgrounds:', err);
        setPlaygrounds(mockPlaygrounds as any);
        setUseMockData(true);
      } finally {
        setLoading(false);
      }
    };

    fetchPlaygrounds();
  }, []);

  // Generate slug from name
  const generateSlug = (name: string): string => {
    return name
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-');
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-6 md:py-8">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-4">Featured Soft Play Areas</h2>
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-pink-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 md:py-12">
      <h2 className="text-2xl md:text-3xl font-bold text-center mb-4 md:mb-8">Featured Soft Play Areas</h2>
      
      {useMockData && (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-2 rounded mb-6 text-sm">
          Note: Displaying sample data for demonstration purposes.
        </div>
      )}
      
      {playgrounds.length === 0 ? (
        <p className="text-center text-gray-600">No soft play areas found. Check back soon!</p>
      ) : (
        <>
          {/* Mobile List View */}
          <div className="md:hidden space-y-4">
            {playgrounds.map((playground) => {
              const citySlug = playground.city.toLowerCase().replace(/\s+/g, '-');
              const nameSlug = generateSlug(playground.name);
              
              // Create a plain text excerpt from the description
              const descriptionExcerpt = createExcerpt(playground.description, 60);
              
              return (
                <Link key={playground.id} to={`/soft-play/${citySlug}/${nameSlug}`} state={{ playground }} className="block">
                  <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                    <div className="flex">
                      <div className="w-1/3 h-24 relative">
                        <img
                          src={playground.image_url || 'https://images.unsplash.com/photo-1566454825481-9c31bd88c36f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60'}
                          alt={playground.name}
                          className="w-full h-full object-cover"
                          loading="eager"
                          width="100"
                          height="100"
                        />
                      </div>
                      <div className="w-2/3 p-2">
                        <h3 className="text-base font-bold text-gray-800 mb-0.5 line-clamp-1">{playground.name}</h3>
                        
                        <div className="flex items-center mb-0.5">
                          <MapPin className="h-3 w-3 text-gray-500 mr-1 flex-shrink-0" />
                          <span className="text-gray-600 text-xs">{playground.city}</span>
                        </div>
                        
                        {playground.google_rating && (
                          <div className="flex items-center mb-1">
                            <Star className="h-3 w-3 text-yellow-400 mr-1 flex-shrink-0" />
                            <span className="text-gray-700 text-xs font-medium">{playground.google_rating}</span>
                            <span className="text-gray-500 text-xs ml-1">({playground.google_reviews_count})</span>
                          </div>
                        )}
                        
                        {playground.features && playground.features.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {playground.features.slice(0, 2).map((feature, index) => (
                              <span key={index} className="bg-gray-100 text-gray-700 px-1.5 py-0.5 rounded text-xs">
                                {feature}
                              </span>
                            ))}
                            {playground.features.length > 2 && (
                              <span className="bg-gray-100 text-gray-700 px-1.5 py-0.5 rounded text-xs">
                                +{playground.features.length - 2}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
          
          {/* Desktop Grid View */}
          <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {playgrounds.map(playground => (
              <PlaygroundCard key={playground.id} playground={playground} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default FeaturedPlaygrounds;