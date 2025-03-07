import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase, mockPlaygrounds, safeSupabaseQuery } from '../lib/supabase';
import { Database } from '../types/supabase';
import SearchBar from '../components/SearchBar';
import Map from '../components/Map';
import { MapPin, Search, Star } from 'lucide-react';

type Playground = Database['public']['Tables']['playgrounds']['Row'];

const SoftPlayNearMePage: React.FC = () => {
  const [playgrounds, setPlaygrounds] = useState<Playground[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [useMockData, setUseMockData] = useState(false);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationStatus, setLocationStatus] = useState<'idle' | 'requesting' | 'denied' | 'granted'>('idle');

  useEffect(() => {
    // Try to get user's location
    const getUserLocation = () => {
      setLocationStatus('requesting');
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setUserLocation({
              lat: position.coords.latitude,
              lng: position.coords.longitude
            });
            setLocationStatus('granted');
          },
          (error) => {
            console.error('Error getting location:', error);
            setLocationStatus('denied');
            // Load default playgrounds if location access is denied
            fetchPlaygrounds();
          }
        );
      } else {
        console.error('Geolocation is not supported by this browser.');
        setLocationStatus('denied');
        // Load default playgrounds if geolocation is not supported
        fetchPlaygrounds();
      }
    };

    getUserLocation();
  }, []);

  useEffect(() => {
    // If we have user location, fetch nearby playgrounds
    if (userLocation) {
      fetchNearbyPlaygrounds();
    }
  }, [userLocation]);

  const fetchPlaygrounds = async () => {
    try {
      setLoading(true);
      
      const { data, error, usedFallback } = await safeSupabaseQuery(
        () => supabase
          .from('playgrounds')
          .select('*')
          .order('google_rating', { ascending: false })
          .limit(9),
        []
      );
      
      if (error && !usedFallback) {
        throw error;
      }
      
      if (data && data.length > 0) {
        setPlaygrounds(data);
        setUseMockData(usedFallback);
      } else {
        // Use mock data if no results
        setPlaygrounds(mockPlaygrounds as any);
        setUseMockData(true);
      }
    } catch (err) {
      console.error('Error fetching soft play areas:', err);
      setError('Failed to load soft play areas. Please try again later.');
      
      // Use mock data as fallback
      setPlaygrounds(mockPlaygrounds as any);
      setUseMockData(true);
    } finally {
      setLoading(false);
    }
  };

  const fetchNearbyPlaygrounds = async () => {
    // In a real app, we would use the user's location to find nearby playgrounds
    // For now, we'll just fetch all playgrounds and sort them by a simulated distance
    try {
      setLoading(true);
      
      const { data, error, usedFallback } = await safeSupabaseQuery(
        () => supabase
          .from('playgrounds')
          .select('*'),
        []
      );
      
      if (error && !usedFallback) {
        throw error;
      }
      
      if (data && data.length > 0) {
        // Sort by simulated distance (if we have coordinates)
        const sortedData = [...data].sort((a, b) => {
          if (a.latitude && a.longitude && b.latitude && b.longitude && userLocation) {
            const distA = calculateDistance(
              userLocation.lat, 
              userLocation.lng, 
              a.latitude, 
              a.longitude
            );
            const distB = calculateDistance(
              userLocation.lat, 
              userLocation.lng, 
              b.latitude, 
              b.longitude
            );
            return distA - distB;
          }
          return 0;
        });
        
        setPlaygrounds(sortedData);
        setUseMockData(usedFallback);
      } else {
        // Use mock data if no results
        const sortedMockData = [...mockPlaygrounds] as any[];
        if (userLocation) {
          sortedMockData.sort((a, b) => {
            if (a.latitude && a.longitude && b.latitude && b.longitude) {
              const distA = calculateDistance(
                userLocation.lat, 
                userLocation.lng, 
                a.latitude, 
                a.longitude
              );
              const distB = calculateDistance(
                userLocation.lat, 
                userLocation.lng, 
                b.latitude, 
                b.longitude
              );
              return distA - distB;
            }
            return 0;
          });
        }
        
        setPlaygrounds(sortedMockData);
        setUseMockData(true);
      }
    } catch (err) {
      console.error('Error fetching nearby soft play areas:', err);
      setError('Failed to load nearby soft play areas. Please try again later.');
      
      // Use mock data as fallback
      setPlaygrounds(mockPlaygrounds as any);
      setUseMockData(true);
    } finally {
      setLoading(false);
    }
  };

  // Calculate distance between two points using Haversine formula
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2); 
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    const d = R * c; // Distance in km
    return d;
  };

  const deg2rad = (deg: number): number => {
    return deg * (Math.PI/180);
  };

  // Generate slug from name
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
          backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(https://images.unsplash.com/photo-1566454825481-9c31bd88c36f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80)'
        }}
      >
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-2xl md:text-5xl font-bold text-white mb-4 md:mb-6">
            Soft Play Areas Near Me
          </h1>
          <p className="text-base md:text-xl text-white mb-6 md:mb-8 max-w-3xl mx-auto">
            Find the closest soft play areas to your location. Perfect for rainy days and family outings.
          </p>
          
          <SearchBar className="max-w-4xl mx-auto" />
          
          {locationStatus === 'requesting' && (
            <div className="mt-4 text-white">
              <div className="inline-block animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
              Requesting your location...
            </div>
          )}
          
          {locationStatus === 'denied' && (
            <div className="mt-4 text-white bg-pink-600/50 p-2 rounded-lg inline-block">
              Location access denied. Showing all soft play areas instead.
            </div>
          )}
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumbs */}
        <div className="mb-6 text-sm text-gray-600">
          <Link to="/" className="hover:text-pink-500">Home</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-800 font-medium">Soft Play Near Me</span>
        </div>
        
        {useMockData && (
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-2 rounded mb-6 text-sm">
            Note: Displaying sample data for demonstration purposes.
          </div>
        )}
        
        {/* Results Header */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            {locationStatus === 'granted' 
              ? `Soft Play Areas Near Your Location` 
              : `Soft Play Areas in the UK`}
          </h2>
          <p className="text-gray-600">
            {locationStatus === 'granted' 
              ? `We've found ${playgrounds.length} soft play areas near you` 
              : `Browse soft play areas across the UK`}
          </p>
        </div>
        
        {/* Loading State */}
        {loading && (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
          </div>
        )}
        
        {/* Error State */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        
        {/* Results Grid */}
        {!loading && !error && playgrounds.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {playgrounds.map(playground => {
              // Format city name for URL
              const citySlug = playground.city.toLowerCase().replace(/\s+/g, '-');
              const nameSlug = generateSlug(playground.name);
              
              return (
                <Link 
                  key={playground.id} 
                  to={`/${citySlug}/${nameSlug}`}
                  state={{ playground }}
                  className="block bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="relative h-48">
                    <img
                      src={playground.image_url || 'https://images.unsplash.com/photo-1566454825481-9c31bd88c36f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60'}
                      alt={playground.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    {userLocation && playground.latitude && playground.longitude && (
                      <div className="absolute top-4 right-4 bg-pink-500 text-white px-2 py-1 rounded text-sm font-medium">
                        {calculateDistance(
                          userLocation.lat,
                          userLocation.lng,
                          playground.latitude,
                          playground.longitude
                        ).toFixed(1)} km
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-bold text-gray-800 mb-2">{playground.name}</h3>
                    
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
                    
                    {playground.features && playground.features.length > 0 && (
                      <div className="flex flex-wrap gap-1">
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
                </Link>
              );
            })}
          </div>
        )}
        
        {/* Map View */}
        {!loading && !error && playgrounds.length > 0 && (
          <div className="mt-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Map View</h2>
            <div className="h-[500px] rounded-lg overflow-hidden shadow-md">
              <Map 
                playgrounds={playgrounds} 
                center={userLocation ? [userLocation.lat, userLocation.lng] : undefined}
              />
            </div>
          </div>
        )}
        
        {/* SEO Content */}
        <div className="mt-12 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Finding Soft Play Areas Near You</h2>
          <div className="prose max-w-none">
            <p>
              Looking for the perfect soft play area near your location? Our "Soft Play Near Me" feature helps you discover 
              the closest indoor play centers for your children, making it easy to plan fun activities regardless of the weather.
            </p>
            <p>
              Soft play areas provide a safe, controlled environment where children can develop physical skills, build confidence, 
              and make new friends. They're ideal for rainy days, birthday parties, or simply giving your kids a chance to burn 
              off some energy.
            </p>
            <p>
              By allowing location access, you can see soft play venues sorted by distance from your current location. Each listing 
              includes essential information such as ratings, facilities, and contact details to help you make the best choice for 
              your family.
            </p>
            <p>
              Many soft play centers offer additional amenities like cafés for parents, dedicated areas for different age groups, 
              and special needs sessions. Use our detailed listings to find the perfect match for your requirements.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SoftPlayNearMePage;