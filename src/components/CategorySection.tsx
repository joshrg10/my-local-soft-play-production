import React from 'react';
import { Link } from 'react-router-dom';
import { Baby, Cake, Coffee, Car, Clock } from 'lucide-react';

const categories = [
  {
    name: 'Toddler Friendly',
    icon: <Baby className="h-8 w-8 text-pink-500 mb-3" />,
    description: 'Safe spaces for the little ones',
    link: '/search?category=toddler'
  },
  {
    name: 'Party Venues',
    icon: <Cake className="h-8 w-8 text-pink-500 mb-3" />,
    description: 'Perfect for birthday celebrations',
    link: '/search?category=party'
  },
  {
    name: 'With Cafés',
    icon: <Coffee className="h-8 w-8 text-pink-500 mb-3" />,
    description: 'Relax while kids play',
    link: '/search?category=cafe'
  },
  {
    name: 'Free Parking',
    icon: <Car className="h-8 w-8 text-pink-500 mb-3" />,
    description: 'Venues with free parking',
    link: '/search?category=parking'
  },
  {
    name: 'Open Late',
    icon: <Clock className="h-8 w-8 text-pink-500 mb-3" />,
    description: 'Evening play options',
    link: '/search?category=late'
  }
];

const CategorySection: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-12 overflow-x-hidden">
      <h2 className="text-3xl font-bold text-center mb-8">Browse Soft Play by Category</h2>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 md:gap-6">
        {categories.map((category, index) => (
          <Link 
            key={index} 
            to={category.link}
            className="bg-white rounded-lg shadow-md p-4 md:p-6 text-center hover:shadow-lg transition-shadow duration-300"
          >
            <div className="flex flex-col items-center">
              {category.icon}
              <h3 className="text-lg md:text-xl font-semibold mb-1 md:mb-2">{category.name}</h3>
              <p className="text-sm md:text-base text-gray-600">{category.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CategorySection;