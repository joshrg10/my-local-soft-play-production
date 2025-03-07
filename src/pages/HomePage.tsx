import React, { lazy, Suspense, useEffect, useState } from 'react';
import SearchBar from '../components/SearchBar';
import { supabase, mockPlaygrounds, safeSupabaseQuery } from '../lib/supabase';
import { Link } from 'react-router-dom';
import { MapPin, Star } from 'lucide-react';
import { Database } from '../types/supabase';
import { createExcerpt } from '../utils/formatDescription';
import PlaygroundCard from '../components/PlaygroundCard';

// Lazy load non-critical components
const PopularLocations = lazy(() => import('../components/PopularLocations'));
const CategorySection = lazy(() => import('../components/CategorySection'));
const TestimonialSection = lazy(() => import('../components/TestimonialSection'));

// Loading fallback component
const LoadingFallback = () => (
  <div className="py-8 flex justify-center">
    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-pink-500"></div>
  </div>
);

type Playground = Database['public']['Tables']['playgrounds']['Row'];

const HomePage: React.FC = () => {
  const [featuredPlaygrounds, setFeaturedPlaygrounds] = useState<Playground[]>([]);
  const [loading, setLoading] = useState(true);
  const [useMockData, setUseMockData] = useState(false);

  useEffect(() => {
    const fetchPlaygrounds = async () => {
      try {
        setLoading(true);
        
        const { data, error, usedFallback } = await safeSupabaseQuery(
          () => supabase
            .from('playgrounds')
            .select('id, name, city, postcode, image_url, google_rating, google_reviews_count, features, description')
            .limit(3),
          []
        );
          
        if (error && !usedFallback) throw error;
        
        if (data && data.length > 0) {
          setFeaturedPlaygrounds(data);
          setUseMockData(usedFallback);
        } else {
          console.log('No data from Supabase, using mock data');
          setFeaturedPlaygrounds(mockPlaygrounds as any);
          setUseMockData(true);
        }
      } catch (err) {
        console.error('Error fetching playgrounds:', err);
        setFeaturedPlaygrounds(mockPlaygrounds as any);
        setUseMockData(true);
      } finally {
        setLoading(false);
      }
    };

    fetchPlaygrounds();
  }, []);

  const generateSlug = (name: string): string => {
    return name
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-');
  };

  return (
    <div>
      {/* Hero Section */}
      <div 
        className="relative bg-cover bg-center py-16 md:py-24" 
        style={{ 
          backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(https://images.unsplash.com/photo-1596464716127-f2a82984de30?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80&auto=format&fit=crop&w=800&q=60)'
        }}
      >
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-2xl md:text-5xl font-bold text-white mb-4 md:mb-6">
            Find the best soft play areas for kids in the UK
          </h1>
          <p className="text-base md:text-xl text-white mb-6 md:mb-8 max-w-3xl mx-auto">
            Discover fun, safe, and exciting soft play areas near you. Perfect for rainy days and family outings.
          </p>
          
          <SearchBar className="max-w-4xl mx-auto" />
        </div>
      </div>

      {/* Featured Soft Play Areas */}
      <div className="container mx-auto px-4 py-6 md:py-12">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-4 md:mb-8">Featured Soft Play Areas</h2>
        
        {useMockData && (
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-2 rounded mb-6 text-sm">
            Note: Displaying sample data for demonstration purposes.
          </div>
        )}
        
        {loading ? (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-pink-500"></div>
          </div>
        ) : featuredPlaygrounds.length === 0 ? (
          <p className="text-center text-gray-600">No soft play areas found. Check back soon!</p>
        ) : (
          <>
            {/* Mobile List View */}
            <div className="md:hidden space-y-4">
              {featuredPlaygrounds.map((playground) => {
                const citySlug = playground.city.toLowerCase().replace(/\s+/g, '-');
                const nameSlug = generateSlug(playground.name);
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
                          
                          <p className="text-gray-600 text-xs line-clamp-2">{descriptionExcerpt}</p>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
            
            {/* Desktop Grid View */}
            <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredPlaygrounds.map(playground => (
                <PlaygroundCard key={playground.id} playground={playground} />
              ))}
            </div>
          </>
        )}
      </div>
      
      {/* Lazy loaded components */}
      <Suspense fallback={<LoadingFallback />}>
        <CategorySection />
      </Suspense>
      
      <Suspense fallback={<LoadingFallback />}>
        <PopularLocations />
      </Suspense>
      
      <Suspense fallback={<LoadingFallback />}>
        <TestimonialSection />
      </Suspense>
      
      {/* CTA Section */}
      <div className="bg-pink-600 py-8 md:py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-xl md:text-3xl font-bold text-white mb-4 md:mb-6">
            Own a soft play area?
          </h2>
          <p className="text-base md:text-xl text-white mb-6 md:mb-8 max-w-2xl mx-auto">
            List your venue on My Local Soft Play and reach thousands of families looking for fun activities for their children.
          </p>
          <button className="bg-white text-pink-600 font-bold py-2 md:py-3 px-6 md:px-8 rounded-lg hover:bg-gray-100 transition duration-200">
            Add Your Soft Play Area
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;