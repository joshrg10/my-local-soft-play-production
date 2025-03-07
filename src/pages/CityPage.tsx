import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
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
  Baby, 
  Clock,
  Check,
  Star
} from 'lucide-react';

type Playground = Database['public']['Tables']['playgrounds']['Row'];

const CityPage: React.FC = () => {
  const { city } = useParams<{ city: string }>();
  const [playgrounds, setPlaygrounds] = useState<Playground[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [useMockData, setUseMockData] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'map'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedAgeRanges, setSelectedAgeRanges] = useState<string[]>([]);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [selectedRatings, setSelectedRatings] = useState<number[]>([]);
  const [openToday, setOpenToday] = useState(false);
  const [cityInfo, setCityInfo] = useState({
    name: '',
    description: '',
    image: ''
  });

  // Format city name for display (capitalize first letter of each word)
  const formattedCityName = city
    ? city.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
    : '';

  // Get current day of the week
  const getCurrentDay = (): string => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayIndex = new Date().getDay();
    return days[dayIndex];
  };

  const currentDay = getCurrentDay();

  useEffect(() => {
    // Set city info based on city name
    const cityImages: Record<string, string> = {
      'london': 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80',
      'manchester': 'https://images.unsplash.com/photo-1543872084-c7bd3822856f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80',
      'birmingham': 'https://images.unsplash.com/photo-1549880338-65ddcdfd017b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80',
      'edinburgh': 'https://images.unsplash.com/photo-1566226015878-2a952bcf4337?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80',
      'glasgow': 'https://images.unsplash.com/photo-1589909202802-8f4aadce1849?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80',
      'leeds': 'https://images.unsplash.com/photo-1549880181-56a44cf4a7a5?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80',
      'liverpool': 'https://images.unsplash.com/photo-1523731407965-2430cd12f5e4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80',
      'bristol': 'https://images.unsplash.com/photo-1587409968798-95a0f757a5c1?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80'
    };

    const cityDescriptions: Record<string, string> = {
      'london': 'Discover the best soft play near London, perfect for keeping kids entertained whatever the weather. From large adventure centers to cozy play cafés, London offers a variety of options for children of all ages.',
      'manchester': 'Manchester boasts some of the UK\'s most exciting soft play areas, with innovative designs and excellent facilities for both children and parents. Find the perfect indoor play space for your family.',
      'birmingham': 'Birmingham\'s soft play scene offers a diverse range of indoor play options for families. From multi-level adventure zones to sensory play areas for younger children, there\'s something for everyone.',
      'edinburgh': 'Edinburgh\'s soft play centers provide the perfect escape from Scotland\'s unpredictable weather. With state-of-the-art facilities and creative play spaces, they\'re ideal for family days out in the capital.',
      'glasgow': 'Glasgow is home to some fantastic soft play venues where children can burn off energy while parents relax. These centers offer safe, clean environments with a range of activities for different age groups.',
      'leeds': 'Leeds has a growing number of high-quality soft play areas, from small independent venues to large chains. These spaces provide the perfect environment for children to develop physical and social skills while having fun.',
      'liverpool': 'Liverpool\'s soft play centers combine fun with learning, offering themed play areas and activities that stimulate imagination. They\'re perfect for birthday parties or regular visits throughout the year.',
      'bristol': 'Bristol\'s family-friendly soft play venues cater to children of all ages and abilities. With cafés for parents and exciting play equipment for kids, they\'re a popular choice for local families.'
    };

    if (city) {
      const normalizedCityName = city.toLowerCase();
      setCityInfo({
        name: formattedCityName,
        description: cityDescriptions[normalizedCityName] || `Discover the best soft play areas in ${formattedCityName}`,
        image: cityImages[normalizedCityName] || 'https://images.unsplash.com/photo-1566454825481-9c31bd88c36f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80'
      });
    }

    // Fetch playgrounds for this city
    const fetchPlaygrounds = async () => {
      try {
        setLoading(true);
        setError(null);
        
        if (!city) {
          throw new Error('City name is required');
        }

        const formattedCity = city.replace(/-/g, ' ');
        
        const { data, error, usedFallback } = await safeSupabaseQuery(
          () => supabase
            .from('playgrounds')
            .select('*')
            .ilike('city', formattedCity),
          []
        );

        if (error && !usedFallback) {
          throw error;
        }

        if (data && data.length > 0) {
          setPlaygrounds(data);
          setUseMockData(usedFallback);
        } else {
          // Filter mock data based on city
          const filteredMockData = mockPlaygrounds.filter(
            p => p.city.toLowerCase() === formattedCity.toLowerCase()
          ) as any[];
          
          setPlaygrounds(filteredMockData);
          setUseMockData(true);
        }
      } catch (err) {
        console.error('Error fetching soft play areas:', err);
        setError('Failed to load soft play areas. Please try again later.');
        
        // Use mock data as fallback
        const filteredMockData = mockPlaygrounds.filter(
          p => p.city.toLowerCase() === city?.replace(/-/g, ' ').toLowerCase()
        ) as any[];
        
        setPlaygrounds(filteredMockData);
        setUseMockData(true);
      } finally {
        setLoading(false);
      }
    };

    fetchPlaygrounds();
  }, [city, formattedCityName]);

  const toggleAgeRange = (age: string) => {
    setSelectedAgeRanges(prev => 
      prev.includes(age) 
        ? prev.filter(a => a !== age) 
        : [...prev, age]
    );
  };

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

  // Filter playgrounds based on selected filters
  const filteredPlaygrounds = playgrounds.filter(playground => {
    // Filter by age range
    if (selectedAgeRanges.length > 0) {
      const hasMatchingAgeRange = selectedAgeRanges.some(age => 
        playground.features?.some(feature => feature.includes(age))
      );
      if (!hasMatchingAgeRange) return false;
    }

    // Filter by features
    if (selectedFeatures.length > 0) {
      const hasAllFeatures = selectedFeatures.every(feature =>
        playground.features?.includes(feature)
      );
      if (!hasAllFeatures) return false;
    }

    // Filter by rating
    if (selectedRatings.length > 0) {
      const minRating = Math.min(...selectedRatings);
      if (!playground.google_rating || playground.google_rating < minRating) return false;
    }

    // Filter by opening hours
    if (openToday && playground.opening_hours) {
      const hours = playground.opening_hours[currentDay];
      if (!hours) return false;
    }

    return true;
  });

  return (
    <div>
      {/* Hero Section */}
      <div 
        className="relative bg-cover bg-center py-16 md:py-24" 
        style={{ 
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(${cityInfo.image})`
        }}
      >
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-2xl md:text-5xl font-bold text-white mb-4 md:mb-6">
            Soft Play Near {cityInfo.name}
          </h1>
          <p className="text-base md:text-xl text-white mb-6 md:mb-8 max-w-3xl mx-auto">
            {cityInfo.description}
          </p>
          
          <SearchBar className="max-w-4xl mx-auto" />
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumbs */}
        <div className="mb-6 text-sm text-gray-600">
          <Link to="/" className="hover:text-pink-500">Home</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-800 font-medium">{cityInfo.name}</span>
        </div>
        
        {useMockData && (
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-2 rounded mb-6 text-sm">
            Note: Displaying sample data for demonstration purposes.
          </div>
        )}
        
        {/* Results Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              {filteredPlaygrounds.length} Soft Play Areas in {cityInfo.name}
            </h2>
            <p className="text-gray-600">
              Browse and find the best soft play areas for your children
            </p>
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
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Age Range Filter */}
              <div>
                <h3 className="font-medium mb-3 flex items-center">
                  <Baby className="h-4 w-4 mr-2" />
                  Age Range
                </h3>
                <div className="space-y-2">
                  {['0-2', '3-5', '6-8', '9-12', '13+'].map(age => (
                    <label key={age} className="flex items-center">
                      <input 
                        type="checkbox" 
                        checked={selectedAgeRanges.includes(age)}
                        onChange={() => toggleAgeRange(age)}
                        className="rounded text-pink-500 focus:ring-pink-500 mr-2"
                      />
                      <span>{age} years</span>
                    </label>
                  ))}
                </div>
              </div>
              
              {/* Features Filter */}
              <div>
                <h3 className="font-medium mb-3 flex items-center">
                  <Check className="h-4 w-4 mr-2" />
                  Features
                </h3>
                <div className="space-y-2">
                  {['Soft Play', 'Ball Pit', 'Café', 'Party Rooms', 'Parking', 'Climbing Frames', 'Accessible'].map(feature => (
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
            {(selectedAgeRanges.length > 0 || selectedFeatures.length > 0 || selectedRatings.length > 0 || openToday) && (
              <div className="mt-6 pt-4 border-t border-gray-200">
                <div className="flex flex-wrap gap-2">
                  {selectedAgeRanges.map(age => (
                    <span 
                      key={age} 
                      className="bg-pink-100 text-pink-800 px-2 py-1 rounded-full text-sm flex items-center"
                    >
                      Age: {age}
                      <button 
                        onClick={() => toggleAgeRange(age)}
                        className="ml-1 text-pink-800 hover:text-pink-900"
                      >
                        &times;
                      </button>
                    </span>
                  ))}
                  
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
                      setSelectedAgeRanges([]);
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
        
        {/* Results Grid */}
        {!loading && !error && filteredPlaygrounds.length > 0 && viewMode === 'grid' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPlaygrounds.map(playground => (
              <PlaygroundCard key={playground.id} playground={playground} />
            ))}
          </div>
        )}
        
        {/* Results List */}
        {!loading && !error && filteredPlaygrounds.length > 0 && viewMode === 'list' && (
          <div className="space-y-6">
            {filteredPlaygrounds.map(playground => {
              const citySlug = playground.city.toLowerCase().replace(/\s+/g, '-');
              const nameSlug = playground.name
                .toLowerCase()
                .replace(/[^\w\s-]/g, '')
                .replace(/\s+/g, '-');
              
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
                      
                      <p className="text-gray-600 mb-3">{playground.description.substring(0, 150)}...</p>
                      
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
        {!loading && !error && filteredPlaygrounds.length > 0 && viewMode === 'map' && (
          <div className="h-[600px] rounded-lg overflow-hidden">
            <Map playgrounds={filteredPlaygrounds} />
          </div>
        )}
        
        {/* No Results */}
        {!loading && !error && filteredPlaygrounds.length === 0 && (
          <div className="bg-gray-50 rounded-lg p-8 text-center">
            <h2 className="text-xl font-semibold text-gray-700 mb-2">No soft play areas found in {cityInfo.name}</h2>
            <p className="text-gray-600 mb-6">Try adjusting your search criteria or browse all soft play areas.</p>
            <Link to="/" className="bg-pink-500 hover:bg-pink-600 text-white font-bold py-2 px-6 rounded transition duration-200">
              Back to Home
            </Link>
          </div>
        )}
        
        {/* SEO Content */}
        <div className="mt-12 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Finding the Best Soft Play in {cityInfo.name}</h2>
          <div className="prose max-w-none">
            <p>
              Looking for the perfect soft play area in {cityInfo.name} for your children? Our comprehensive guide 
              showcases the top-rated venues where kids can play safely while developing important physical and social skills.
            </p>
            <p>
              Soft play areas provide an ideal environment for children to burn off energy, especially during bad weather. 
              {cityInfo.name}'s soft play centers offer a range of facilities including ball pits, slides, climbing frames, 
              and dedicated areas for different age groups.
            </p>
            <p>
              Many venues also provide comfortable seating areas for parents, along with café facilities serving refreshments 
              and meals. Some centers offer additional services such as party packages, making them perfect for celebrating 
              special occasions.
            </p>
            <p>
              Use our search tools to find soft play areas near {cityInfo.name} that match your specific requirements, 
              whether you're looking for venues suitable for toddlers, centers with parking facilities, or places that 
              offer good value for money.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CityPage;