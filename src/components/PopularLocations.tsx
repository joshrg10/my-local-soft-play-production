import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase, mockLocationCounts, safeSupabaseQuery } from '../lib/supabase';
import { MapPin } from 'lucide-react';

interface LocationData {
  name: string;
  image: string;
  count: number;
}

const PopularLocations: React.FC = () => {
  const [locations, setLocations] = useState<LocationData[]>([
    {
      name: 'London',
      image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60',
      count: 0
    },
    {
      name: 'Manchester',
      image: 'https://images.unsplash.com/photo-1543872084-c7bd3822856f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60',
      count: 0
    },
    {
      name: 'Birmingham',
      image: 'https://images.unsplash.com/photo-1549880338-65ddcdfd017b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60',
      count: 0
    },
    {
      name: 'Edinburgh',
      image: 'https://images.unsplash.com/photo-1566226015878-2a952bcf4337?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60',
      count: 0
    }
  ]);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [useMockData, setUseMockData] = useState(false);

  useEffect(() => {
    const fetchLocationCounts = async () => {
      try {
        setLoading(true);
        
        // Create a copy of the locations array to update
        const updatedLocations = [...locations];
        let hadError = false;
        
        // Fetch counts for each location
        const { data: allPlaygrounds, error: fetchError, usedFallback } = await safeSupabaseQuery(
          () => supabase
            .from('playgrounds')
            .select('city'),
          []
        );

        if (fetchError && !usedFallback) {
          hadError = true;
          throw fetchError;
        }

        if (allPlaygrounds) {
          // Count playgrounds for each city
          const cityCounts = allPlaygrounds.reduce((acc: Record<string, number>, playground) => {
            const city = playground.city;
            acc[city] = (acc[city] || 0) + 1;
            return acc;
          }, {});

          // Update location counts
          updatedLocations.forEach((location, index) => {
            updatedLocations[index] = {
              ...location,
              count: cityCounts[location.name] || 0
            };
          });

          setLocations(updatedLocations);
          setUseMockData(usedFallback);
        } else {
          // Fallback to mock data
          const updatedLocations = locations.map(location => ({
            ...location,
            count: mockLocationCounts[location.name as keyof typeof mockLocationCounts] || 0
          }));
          
          setLocations(updatedLocations);
          setUseMockData(true);
        }
      } catch (err) {
        console.error('Error fetching location counts:', err);
        setError('Failed to load location data');
        
        // Fallback to mock data
        const updatedLocations = locations.map(location => ({
          ...location,
          count: mockLocationCounts[location.name as keyof typeof mockLocationCounts] || 0
        }));
        
        setLocations(updatedLocations);
        setUseMockData(true);
      } finally {
        setLoading(false);
      }
    };

    fetchLocationCounts();
  }, []);

  // Format city name for URL
  const formatCitySlug = (name: string): string => {
    return name.toLowerCase().replace(/\s+/g, '-');
  };

  return (
    <div className="bg-gray-50 py-6 md:py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-4 md:mb-8">Popular Soft Play Locations</h2>
        
        {useMockData && (
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-2 rounded mb-6 text-sm">
            Note: Displaying sample data for demonstration purposes.
          </div>
        )}
        
        {/* Mobile View */}
        <div className="md:hidden space-y-3">
          {locations.map((location, index) => (
            <Link 
              key={index} 
              to={`/soft-play/${formatCitySlug(location.name)}`}
              className="block"
            >
              <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <div className="flex">
                  <div className="w-1/3 h-20 relative">
                    <img 
                      src={location.image} 
                      alt={location.name} 
                      className="h-full w-full object-cover"
                      loading="lazy"
                      width="100"
                      height="80"
                    />
                  </div>
                  <div className="w-2/3 p-3 flex flex-col justify-center">
                    <div className="flex items-center">
                      <MapPin className="h-3 w-3 text-pink-500 mr-1 flex-shrink-0" />
                      <h3 className="text-base font-bold text-gray-800">{location.name}</h3>
                    </div>
                    {loading ? (
                      <p className="text-xs text-gray-500">Loading...</p>
                    ) : (
                      <p className="text-xs text-gray-600">{location.count} {location.count === 1 ? 'soft play area' : 'soft play areas'}</p>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
        
        {/* Desktop View */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {locations.map((location, index) => (
            <Link 
              key={index} 
              to={`/soft-play/${formatCitySlug(location.name)}`}
              className="group relative rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300"
            >
              <div className="h-64 w-full">
                <img 
                  src={location.image} 
                  alt={location.name} 
                  className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                  width="300"
                  height="256"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                  <h3 className="text-xl font-bold mb-1">{location.name}</h3>
                  {loading ? (
                    <p className="text-gray-300">Loading...</p>
                  ) : (
                    <p>{location.count} {location.count === 1 ? 'soft play area' : 'soft play areas'}</p>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PopularLocations;