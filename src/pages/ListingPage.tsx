import React, { useEffect, useState } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { supabase, mockPlaygrounds, safeSupabaseQuery } from '../lib/supabase';
import { Database } from '../types/supabase';
import Map from '../components/Map';
import { 
  MapPin, 
  Phone,
  Globe, 
  Clock, 
  Star, 
  ArrowLeft,
  Navigation2
} from 'lucide-react';
import { createMarkup, parseMarkdown, createExcerpt } from '../utils/formatDescription';

type Playground = Database['public']['Tables']['playgrounds']['Row'];

const ListingPage: React.FC = () => {
  const { city, slug } = useParams<{ city?: string; slug?: string }>();
  const location = useLocation();
  const [playground, setPlayground] = useState<Playground | null>(null);
  const [similarPlaygrounds, setSimilarPlaygrounds] = useState<Playground[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [useMockData, setUseMockData] = useState(false);
  
  const playgroundFromState = location.state?.playground as Playground | undefined;

  const generateSlug = (name: string): string => {
    return name
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-');
  };

  const getDirectionsUrl = (address: string, postcode: string) => {
    const destination = encodeURIComponent(`${address}, ${postcode}`);
    return `https://www.google.com/maps/dir/?api=1&destination=${destination}`;
  };

  useEffect(() => {
    const fetchPlayground = async () => {
      try {
        setLoading(true);
        
        if (playgroundFromState) {
          setPlayground(playgroundFromState);
          await fetchSimilarPlaygrounds(playgroundFromState.city, playgroundFromState.id);
          setLoading(false);
          return;
        }
        
        if (city && slug) {
          try {
            const { data, error, usedFallback } = await safeSupabaseQuery(
              () => supabase
                .from('playgrounds')
                .select('*')
                .ilike('city', city.replace(/-/g, ' ')),
              []
            );

            if (error && !usedFallback) {
              throw error;
            }

            if (data && data.length > 0) {
              const matchedPlayground = data.find(p => generateSlug(p.name) === slug);
              if (matchedPlayground) {
                setPlayground(matchedPlayground);
                setSimilarPlaygrounds(
                  data
                    .filter(p => p.id !== matchedPlayground.id)
                    .slice(0, 3)
                );
                setUseMockData(usedFallback);
              } else {
                const mockCityPlaygrounds = mockPlaygrounds.filter(
                  p => p.city.toLowerCase() === city.replace(/-/g, ' ').toLowerCase()
                ) as any[];
                
                const mockMatchedPlayground = mockCityPlaygrounds.find(
                  p => generateSlug(p.name) === slug
                );
                
                if (mockMatchedPlayground) {
                  setPlayground(mockMatchedPlayground);
                  setSimilarPlaygrounds(
                    mockCityPlaygrounds
                      .filter(p => p.id !== mockMatchedPlayground.id)
                      .slice(0, 3)
                  );
                  setUseMockData(true);
                } else {
                  throw new Error('Soft play area not found');
                }
              }
            } else {
              const mockCityPlaygrounds = mockPlaygrounds.filter(
                p => p.city.toLowerCase() === city.replace(/-/g, ' ').toLowerCase()
              ) as any[];
              
              const mockMatchedPlayground = mockCityPlaygrounds.find(
                p => generateSlug(p.name) === slug
              );
              
              if (mockMatchedPlayground) {
                setPlayground(mockMatchedPlayground);
                setSimilarPlaygrounds(
                  mockCityPlaygrounds
                    .filter(p => p.id !== mockMatchedPlayground.id)
                    .slice(0, 3)
                );
                setUseMockData(true);
              } else {
                throw new Error('Soft play area not found');
              }
            }
          } catch (err) {
            console.error('Error fetching by city/slug:', err);
            const mockCityPlaygrounds = mockPlaygrounds.filter(
              p => p.city.toLowerCase() === city.replace(/-/g, ' ').toLowerCase()
            ) as any[];
            
            const mockMatchedPlayground = mockCityPlaygrounds.find(
              p => generateSlug(p.name) === slug
            );
            
            if (mockMatchedPlayground) {
              setPlayground(mockMatchedPlayground);
              setSimilarPlaygrounds(
                mockCityPlaygrounds
                  .filter(p => p.id !== mockMatchedPlayground.id)
                  .slice(0, 3)
              );
              setUseMockData(true);
            } else {
              throw new Error('Soft play area not found');
            }
          }
        } else {
          throw new Error('City and slug are required');
        }
      } catch (err) {
        console.error('Error fetching soft play area:', err);
        setError('Failed to load soft play area details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchPlayground();
  }, [city, slug, playgroundFromState]);

  const fetchSimilarPlaygrounds = async (cityName: string, currentId: number) => {
    try {
      const { data, error, usedFallback } = await safeSupabaseQuery(
        () => supabase
          .from('playgrounds')
          .select('*')
          .ilike('city', cityName)
          .neq('id', currentId)
          .limit(3),
        []
      );

      if (error && !usedFallback) {
        throw error;
      }

      if (data && data.length > 0) {
        setSimilarPlaygrounds(data);
      } else {
        const mockSimilar = mockPlaygrounds
          .filter(p => 
            p.city.toLowerCase() === cityName.toLowerCase() && 
            p.id !== currentId
          )
          .slice(0, 3) as any[];
        
        setSimilarPlaygrounds(mockSimilar);
      }
    } catch (err) {
      console.error('Error fetching similar playgrounds:', err);
      const mockSimilar = mockPlaygrounds
        .filter(p => 
          p.city.toLowerCase() === cityName.toLowerCase() && 
          p.id !== currentId
        )
        .slice(0, 3) as any[];
      
      setSimilarPlaygrounds(mockSimilar);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
        </div>
      </div>
    );
  }

  if (error || !playground) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error || 'Soft play area not found'}</span>
        </div>
        <div className="mt-6">
          <Link to="/" className="flex items-center text-pink-600 hover:text-pink-700">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to home
          </Link>
        </div>
      </div>
    );
  }

  const citySlug = playground.city.toLowerCase().replace(/\s+/g, '-');
  const formattedDescription = parseMarkdown(playground.description);

  return (
    <div className="container mx-auto px-4 py-8 overflow-x-hidden">
      <div className="mb-6 text-sm text-gray-600">
        <Link to="/" className="hover:text-pink-500">Home</Link>
        <span className="mx-2">/</span>
        <Link to={`/softplay/location/${citySlug}`} className="hover:text-pink-500">{playground.city}</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-800 font-medium">{playground.name}</span>
      </div>
      
      {useMockData && (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-2 rounded mb-6 text-sm">
          Note: Displaying sample data for demonstration purposes.
        </div>
      )}
      
      <div className="flex flex-col md:flex-row justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">{playground.name}</h1>
          <div className="flex items-center mb-2">
            <MapPin className="h-5 w-5 text-gray-500 mr-2 flex-shrink-0" />
            <span className="text-gray-600">{playground.address}, {playground.city}, {playground.postcode}</span>
          </div>
          {playground.google_rating && (
            <div className="flex items-center">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`h-5 w-5 ${i < Math.floor(playground.google_rating) ? 'text-yellow-400' : 'text-gray-300'}`} 
                    fill={i < Math.floor(playground.google_rating) ? 'currentColor' : 'none'}
                  />
                ))}
              </div>
              <span className="ml-2 text-gray-700 font-medium">{playground.google_rating}</span>
              <span className="ml-1 text-gray-500">({playground.google_reviews_count} Google reviews)</span>
            </div>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="mb-8 rounded-lg overflow-hidden shadow-md">
            <img 
              src={playground.image_url || 'https://images.unsplash.com/photo-1566454825481-9c31bd88c36f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60'} 
              alt={playground.name} 
              className="w-full h-64 md:h-96 object-cover"
              width="800"
              height="400"
            />
          </div>
          
          {playground.features && playground.features.length > 0 && (
            <div className="bg-white rounded-lg shadow-md p-4 md:p-6 mb-8">
              <h3 className="text-lg md:text-xl font-semibold text-gray-800 mb-3">Features</h3>
              <div className="flex flex-wrap gap-2">
                {playground.features.map((feature, index) => (
                  <span key={index} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                    {feature}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          <div className="bg-white rounded-lg shadow-md p-4 md:p-6 mb-8">
            <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4">About This Soft Play Area</h2>
            <div 
              className="prose max-w-none text-gray-700"
              dangerouslySetInnerHTML={createMarkup(formattedDescription)}
            />
          </div>
        </div>
        
        <div>
          {/* Contact Information */}
          <div className="bg-white rounded-lg shadow-md p-4 md:p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Contact Information</h2>
            
            <div className="space-y-4">
              {playground.phone && (
                <div className="flex items-center">
                  <Phone className="h-5 w-5 text-pink-500 mr-3 flex-shrink-0" />
                  <a href={`tel:${playground.phone}`} className="text-gray-700 hover:text-pink-600">
                    {playground.phone}
                  </a>
                </div>
              )}
              
              {playground.website && (
                <div className="flex items-center">
                  <Globe className="h-5 w-5 text-pink-500 mr-3 flex-shrink-0" />
                  <a 
                    href={playground.website} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-gray-700 hover:text-pink-600"
                  >
                    Visit Website
                  </a>
                </div>
              )}

              <div className="flex items-center">
                <Navigation2 className="h-5 w-5 text-pink-500 mr-3 flex-shrink-0" />
                <a 
                  href={getDirectionsUrl(playground.address, playground.postcode)}
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-gray-700 hover:text-pink-600"
                >
                  Get Directions
                </a>
              </div>
            </div>

            {playground.phone && (
              <div className="mt-6">
                <a 
                  href={`tel:${playground.phone}`}
                  className="w-full bg-pink-500 hover:bg-pink-600 text-white font-bold py-3 px-4 rounded transition duration-200 flex items-center justify-center"
                >
                  <Phone className="h-5 w-5 mr-2" />
                  Call Now
                </a>
              </div>
            )}
          </div>

          {/* Opening Hours */}
          {playground.opening_hours && (
            <div className="bg-white rounded-lg shadow-md p-4 md:p-6 mb-8">
              <div className="flex items-center mb-4">
                <Clock className="h-6 w-6 text-pink-500 mr-2 flex-shrink-0" />
                <h2 className="text-xl font-bold text-gray-800">Opening Hours</h2>
              </div>
              
              <div className="space-y-2">
                {Object.entries(playground.opening_hours as Record<string, string>).map(([day, hours]) => (
                  <div key={day} className="flex justify-between py-2 border-b border-gray-100 last:border-0">
                    <span className="font-medium text-gray-700">{day}</span>
                    <span className="text-gray-600">{hours}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Map */}
          <div className="bg-white rounded-lg shadow-md p-4 md:p-6 mb-8">
            <div className="flex items-center mb-4">
              <MapPin className="h-6 w-6 text-pink-500 mr-2 flex-shrink-0" />
              <h2 className="text-xl font-bold text-gray-800">Location</h2>
            </div>
            
            <Map playground={playground} height="300px" />
            
            <div className="mt-4">
              <p className="text-gray-700">{playground.address}</p>
              <p className="text-gray-700">{playground.city}, {playground.postcode}</p>
            </div>
          </div>

          {/* Similar Soft Play Areas */}
          {similarPlaygrounds.length > 0 && (
            <div className="bg-white rounded-lg shadow-md p-4 md:p-6 mb-8">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Similar Soft Play Areas in {playground.city}</h2>
              
              <div className="space-y-4">
                {similarPlaygrounds.map(similar => {
                  const similarSlug = generateSlug(similar.name);
                  const excerpt = createExcerpt(similar.description, 100);
                  
                  return (
                    <Link 
                      key={similar.id}
                      to={`/softplay/location/${citySlug}/${similarSlug}`}
                      state={{ playground: similar }}
                      className="block"
                    >
                      <div className="border rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
                        <div className="flex items-start">
                          <div className="w-20 h-20 flex-shrink-0">
                            <img
                              src={similar.image_url || 'https://images.unsplash.com/photo-1566454825481-9c31bd88c36f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60'}
                              alt={similar.name}
                              className="w-full h-full object-cover rounded"
                              loading="lazy"
                            />
                          </div>
                          <div className="ml-4 flex-1">
                            <h3 className="font-semibold text-gray-800 mb-1">{similar.name}</h3>
                            {similar.google_rating && (
                              <div className="flex items-center mb-2">
                                <Star className="h-4 w-4 text-yellow-400" />
                                <span className="text-sm text-gray-600 ml-1">
                                  {similar.google_rating} ({similar.google_reviews_count})
                                </span>
                              </div>
                            )}
                            <p className="text-sm text-gray-600 line-clamp-2">{excerpt}</p>
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>

              <Link 
                to={`/softplay/location/${citySlug}`}
                className="inline-block mt-4 text-pink-500 hover:text-pink-600 font-medium"
              >
                View all soft play areas in {playground.city}
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ListingPage;