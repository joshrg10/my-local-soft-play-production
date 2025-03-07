import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { supabase, mockPlaygrounds, safeSupabaseQuery } from '../lib/supabase';
import { Database } from '../types/supabase';
import SearchBar from '../components/SearchBar';
import PlaygroundCard from '../components/PlaygroundCard';
import Map from '../components/Map';
import { 
  MapPin, 
  List, 
  Grid, 
  Filter, 
  Clock,
  Check,
  Star
} from 'lucide-react';
import { createExcerpt } from '../utils/formatDescription';

type Playground = Database['public']['Tables']['playgrounds']['Row'];

const SearchResultsPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [playgrounds, setPlaygrounds] = useState<Playground[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'map'>('grid');
  const [useMockData, setUseMockData] = useState(false);
  
  // Filters
  const [showFilters, setShowFilters] = useState(false);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [selectedRatings, setSelectedRatings] = useState<number[]>([]);
  const [openToday, setOpenToday] = useState(false);
  
  const keyword = searchParams.get('keyword') || '';
  const location = searchParams.get('location') || '';
  const category = searchParams.get('category') || '';

  // Get current day of the week
  const getCurrentDay = (): string => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayIndex = new Date().getDay();
    return days[dayIndex];
  };

  const currentDay = getCurrentDay();

  useEffect(() => {
    const fetchPlaygrounds = async () => {
      try {
        setLoading(true);
        setError(null);
        
        let query = supabase
          .from('playgrounds')
          .select('*');
        
        // Apply search filters
        if (keyword) {
          query = query.or(`name.ilike.%${keyword}%,description.ilike.%${keyword}%`);
        }
        
        // Handle location search (city or postcode)
        if (location) {
          query = query.or(`city.ilike.%${location}%,postcode.ilike.%${location}%`);
        }

        const { data, error } = await query;
        
        if (error) throw error;
        
        let filteredData = data || [];

        // Apply category filters in memory since we can't use ilike with arrays
        if (category && filteredData.length > 0) {
          filteredData = filteredData.filter(playground => {
            const features = playground.features?.map(f => f.toLowerCase()) || [];
            
            switch (category) {
              case 'toddler':
                return features.some(f => 
                  f.includes('toddler') ||
                  f.includes('baby') ||
                  f.includes('0-2') ||
                  f.includes('under 3')
                );
              case 'party':
                return features.some(f => 
                  f.includes('party') ||
                  f.includes('celebration') ||
                  f.includes('events')
                );
              case 'cafe':
                return features.some(f => 
                  f.includes('café') ||
                  f.includes('cafe') ||
                  f.includes('food') ||
                  f.includes('refreshments')
                );
              case 'parking':
                return features.some(f => 
                  f.includes('free parking') ||
                  f.includes('parking') ||
                  f.includes('car park')
                );
              case 'late':
                if (!playground.opening_hours) return false;
                const hours = playground.opening_hours as Record<string, string>;
                return Object.values(hours).some(timeRange => {
                  if (!timeRange) return false;
                  const closingTime = timeRange.split('-')[1]?.trim();
                  if (!closingTime) return false;
                  const [hour] = closingTime.split(':').map(Number);
                  return hour >= 18;
                });
              default:
                return true;
            }
          });
        }

        // Apply additional filters
        if (selectedFeatures.length > 0) {
          filteredData = filteredData.filter(playground => 
            selectedFeatures.every(feature => 
              playground.features?.some(f => 
                f.toLowerCase().includes(feature.toLowerCase())
              )
            )
          );
        }

        if (selectedRatings.length > 0) {
          const minRating = Math.min(...selectedRatings);
          filteredData = filteredData.filter(playground => 
            playground.google_rating && playground.google_rating >= minRating
          );
        }

        if (openToday) {
          filteredData = filteredData.filter(playground => {
            if (!playground.opening_hours) return false;
            const hours = playground.opening_hours as Record<string, string>;
            return hours[currentDay] && hours[currentDay].length > 0;
          });
        }
        
        setPlaygrounds(filteredData);
        setUseMockData(false);
      } catch (err) {
        console.error('Error fetching playgrounds:', err);
        setError('Failed to load soft play areas. Please try again later.');
        
        // Use mock data as fallback
        let mockData = [...mockPlaygrounds] as any[];
        
        // Apply all filters to mock data
        if (keyword) {
          const keywordLower = keyword.toLowerCase();
          mockData = mockData.filter(p => 
            p.name.toLowerCase().includes(keywordLower) || 
            p.description.toLowerCase().includes(keywordLower)
          );
        }
        
        if (location) {
          const locationLower = location.toLowerCase();
          mockData = mockData.filter(p => 
            p.city.toLowerCase().includes(locationLower) || 
            p.postcode.toLowerCase().includes(locationLower)
          );
        }
        
        if (category) {
          mockData = mockData.filter(playground => {
            const features = playground.features?.map(f => f.toLowerCase()) || [];
            switch (category) {
              case 'toddler':
                return features.some(f => 
                  f.includes('toddler') ||
                  f.includes('baby') ||
                  f.includes('0-2') ||
                  f.includes('under 3')
                );
              case 'party':
                return features.some(f => 
                  f.includes('party') ||
                  f.includes('celebration') ||
                  f.includes('events')
                );
              case 'cafe':
                return features.some(f => 
                  f.includes('café') ||
                  f.includes('cafe') ||
                  f.includes('food') ||
                  f.includes('refreshments')
                );
              case 'parking':
                return features.some(f => 
                  f.includes('free parking') ||
                  f.includes('parking') ||
                  f.includes('car park')
                );
              case 'late':
                if (!playground.opening_hours) return false;
                const hours = playground.opening_hours as Record<string, string>;
                return Object.values(hours).some(timeRange => {
                  if (!timeRange) return false;
                  const closingTime = timeRange.split('-')[1]?.trim();
                  if (!closingTime) return false;
                  const [hour] = closingTime.split(':').map(Number);
                  return hour >= 18;
                });
              default:
                return true;
            }
          });
        }

        if (selectedFeatures.length > 0) {
          mockData = mockData.filter(playground => 
            selectedFeatures.every(feature => 
              playground.features?.some(f => 
                f.toLowerCase().includes(feature.toLowerCase())
              )
            )
          );
        }

        if (selectedRatings.length > 0) {
          const minRating = Math.min(...selectedRatings);
          mockData = mockData.filter(playground => 
            playground.google_rating && playground.google_rating >= minRating
          );
        }

        if (openToday) {
          mockData = mockData.filter(playground => {
            if (!playground.opening_hours) return false;
            const hours = playground.opening_hours as Record<string, string>;
            return hours[currentDay] && hours[currentDay].length > 0;
          });
        }
        
        setPlaygrounds(mockData);
        setUseMockData(true);
      } finally {
        setLoading(false);
      }
    };

    fetchPlaygrounds();
  }, [keyword, location, category, selectedFeatures, selectedRatings, openToday, currentDay]);

  const toggleFeature = (feature: string) => {
    setSelectedFeatures(prev => 
      prev.includes(feature) 
        ? prev.filter(f => f !== feature) 
        : [...prev, feature]
    );
  };
  
  const toggleRating = (rating: number) => {
    setSelectedRatings(prev => 
      prev.includes(rating) 
        ? prev.filter(r => r !== rating) 
        : [...prev, rating]
    );
  };

  // Generate slug from name
  const generateSlug = (name: string): string => {
    return name
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Search Bar */}
      <div className="mb-8">
        <SearchBar />
      </div>
      
      {useMockData && (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-2 rounded mb-6 text-sm">
          Note: Displaying sample data for demonstration purposes.
        </div>
      )}
      
      {/* Search Results Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">
            {playgrounds.length} {playgrounds.length === 1 ? 'Soft Play Area' : 'Soft Play Areas'} Found
            {keyword && ` for "${keyword}"`}
            {location && ` in ${location}`}
            {category && ` - ${category.charAt(0).toUpperCase() + category.slice(1)}`}
          </h1>
        </div>
        
        <div className="flex items-center space-x-2 mt-4 md:mt-0">
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center bg-white border border-gray-300 rounded-md px-3 py-2 text-gray-700 hover:bg-gray-50"
          >
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </button>
          
          <div className="bg-white border border-gray-300 rounded-md overflow-hidden flex">
            <button 
              onClick={() => setViewMode('grid')}
              className={`px-3 py-2 ${viewMode === 'grid' ? 'bg-pink-500 text-white' : 'text-gray-700 hover:bg-gray-50'}`}
            >
              <Grid className="h-4 w-4" />
            </button>
            <button 
              onClick={() => setViewMode('list')}
              className={`px-3 py-2 ${viewMode === 'list' ? 'bg-pink-500 text-white' : 'text-gray-700 hover:bg-gray-50'}`}
            >
              <List className="h-4 w-4" />
            </button>
            <button 
              onClick={() => setViewMode('map')}
              className={`px-3 py-2 ${viewMode === 'map' ? 'bg-pink-500 text-white' : 'text-gray-700 hover:bg-gray-50'}`}
            >
              <MapPin className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
      
      {/* Filters */}
      {showFilters && (
        <div className="bg-white rounded-lg shadow-md p-4 md:p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Filter Results</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Features Filter */}
            <div>
              <h3 className="font-medium mb-3 flex items-center">
                <Check className="h-4 w-4 mr-2" />
                Features
              </h3>
              <div className="space-y-2">
                {['Soft Play', 'Ball Pit', 'Café', 'Party Rooms', 'Parking', 'Climbing Frames', 'Free Parking', 'Toddler Area'].map(feature => (
                  <label key={feature} className="flex items-center">
                    <input 
                      type="checkbox" 
                      checked={selectedFeatures.includes(feature)}
                      onChange={() => toggleFeature(feature)}
                      className="rounded text-pink-500 focus:ring-pink-500 mr-2"
                    />
                    <span>{feature}</span>
                  </label>
                ))}
              </div>
            </div>
            
            {/* Google Rating Filter */}
            <div>
              <h3 className="font-medium mb-3 flex items-center">
                <Star className="h-4 w-4 mr-2 text-yellow-400" />
                Google Rating
              </h3>
              <div className="space-y-2">
                {[4.5, 4, 3.5, 3].map(rating => (
                  <label key={rating} className="flex items-center">
                    <input 
                      type="checkbox" 
                      checked={selectedRatings.includes(rating)}
                      onChange={() => toggleRating(rating)}
                      className="rounded text-pink-500 focus:ring-pink-500 mr-2"
                    />
                    <div className="flex items-center">
                      <span>{rating}+ </span>
                      <div className="flex ml-2">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`h-3 w-3 ${i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                            fill={i < Math.floor(rating) ? 'currentColor' : 'none'}
                          />
                        ))}
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
            
            {/* Open Today Filter */}
            <div>
              <h3 className="font-medium mb-3 flex items-center">
                <Clock className="h-4 w-4 mr-2" />
                Opening Hours
              </h3>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input 
                    type="checkbox" 
                    checked={openToday}
                    onChange={() => setOpenToday(!openToday)}
                    className="rounded text-pink-500 focus:ring-pink-500 mr-2"
                  />
                  <span>Open Today ({currentDay})</span>
                </label>
              </div>
            </div>
          </div>
          
          {/* Applied Filters */}
          {(selectedFeatures.length > 0 || selectedRatings.length > 0 || openToday) && (
            <div className="mt-6 pt-4 border-t border-gray-200">
              <div className="flex flex-wrap gap-2">
                {selectedFeatures.map(feature => (
                  <span 
                    key={feature} 
                    className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm flex items-center"
                  >
                    {feature}
                    <button 
                      onClick={() => toggleFeature(feature)}
                      className="ml-1 text-blue-800 hover:text-blue-900"
                    >
                      &times;
                    </button>
                  </span>
                ))}
                
                {selectedRatings.map(rating => (
                  <span 
                    key={rating} 
                    className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-sm flex items-center"
                  >
                    {rating}+ Stars
                    <button 
                      onClick={() => toggleRating(rating)}
                      className="ml-1 text-yellow-800 hover:text-yellow-900"
                    >
                      &times;
                    </button>
                  </span>
                ))}
                
                {openToday && (
                  <span 
                    className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm flex items-center"
                  >
                    Open Today
                    <button 
                      onClick={() => setOpenToday(false)}
                      className="ml-1 text-green-800 hover:text-green-900"
                    >
                      &times;
                    </button>
                  </span>
                )}
                
                <button 
                  onClick={() => {
                    setSelectedFeatures([]);
                    setSelectedRatings([]);
                    setOpenToday(false);
                  }}
                  className="text-gray-600 hover:text-gray-800 text-sm underline"
                >
                  Clear all filters
                </button>
              </div>
            </div>
          )}
        </div>
      )}
      
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
      
      {/* No Results */}
      {!loading && !error && playgrounds.length === 0 && (
        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">No soft play areas found</h2>
          <p className="text-gray-600 mb-6">Try adjusting your search criteria or browse all soft play areas.</p>
          <Link to="/" className="bg-pink-500 hover:bg-pink-600 text-white font-bold py-2 px-6 rounded transition duration-200">
            Back to Home
          </Link>
        </div>
      )}
      
      {/* Results Grid */}
      {!loading && !error && playgrounds.length > 0 && viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {playgrounds.map(playground => (
            <PlaygroundCard key={playground.id} playground={playground} />
          ))}
        </div>
      )}
      
      {/* Results List */}
      {!loading && !error && playgrounds.length > 0 && viewMode === 'list' && (
        <div className="space-y-6">
          {playgrounds.map(playground => {
            const citySlug = playground.city.toLowerCase().replace(/\s+/g, '-');
            const nameSlug = generateSlug(playground.name);
            
            return (
              <Link 
                key={playground.id} 
                to={`/soft-play/${citySlug}/${nameSlug}`}
                state={{ playground }}
                className="block bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
              >
                <div className="flex flex-col md:flex-row">
                  <div className="md:w-1/3 h-48 md:h-auto relative">
                    <img
                      src={playground.image_url || 'https://images.unsplash.com/photo-1566454825481-9c31bd88c36f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60'}
                      alt={playground.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <div className="md:w-2/3 p-4 md:p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{playground.name}</h3>
                    
                    <div className="flex items-center mb-2">
                      <MapPin className="h-4 w-4 text-gray-500 mr-1" />
                      <span className="text-gray-600">{playground.city}, {playground.postcode}</span>
                    </div>
                    
                    {playground.google_rating && (
                      <div className="flex items-center mb-3">
                        <Star className="h-4 w-4 text-yellow-400 mr-1" />
                        <span className="text-gray-700 font-medium">{playground.google_rating}</span>
                        <span className="text-gray-500 text-sm ml-1">({playground.google_reviews_count} reviews)</span>
                      </div>
                    )}
                    
                    <p className="text-gray-600 mb-3">{createExcerpt(playground.description, 150)}</p>
                    
                    {playground.features && playground.features.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {playground.features.slice(0, 5).map((feature, index) => (
                          <span key={index} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                            {feature}
                          </span>
                        ))}
                        {playground.features.length > 5 && (
                          <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                            +{playground.features.length - 5} more
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
      
      {/* Map View */}
      {!loading && !error && playgrounds.length > 0 && viewMode === 'map' && (
        <div className="h-[600px] rounded-lg overflow-hidden">
          <Map playgrounds={playgrounds} />
        </div>
      )}
    </div>
  );
};

export default SearchResultsPage;