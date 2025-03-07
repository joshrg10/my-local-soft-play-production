import React from 'react';
import { Link } from 'react-router-dom';
import { Play as Playground, Heart, Users, Award, MapPin } from 'lucide-react';

const AboutPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">About My Local Soft Play</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Helping families discover the best soft play areas across the United Kingdom since 2023.
        </p>
      </div>
      
      {/* Our Mission */}
      <div className="bg-white rounded-lg shadow-md p-8 mb-12">
        <div className="flex items-center mb-6">
          <Playground className="h-10 w-10 text-pink-500 mr-4" />
          <h2 className="text-3xl font-bold text-gray-800">Our Mission</h2>
        </div>
        
        <p className="text-lg text-gray-700 mb-6">
          At My Local Soft Play, we believe that play is essential for children's development and wellbeing. Our mission is to connect families with the best soft play areas across the UK, making it easy to find safe, fun, and engaging environments for children of all ages.
        </p>
        
        <p className="text-lg text-gray-700">
          We understand that finding the right soft play area can be challenging, especially in a new area or during bad weather. That's why we've created a comprehensive directory of soft play areas, complete with detailed information, reviews, and features to help you make informed decisions about where to take your children.
        </p>
      </div>
      
      {/* Our Values */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <div className="flex justify-center mb-4">
            <Heart className="h-12 w-12 text-pink-500" />
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-3">Family First</h3>
          <p className="text-gray-700">
            We prioritize the needs of families, ensuring our platform provides valuable information that helps parents make the best choices for their children.
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <div className="flex justify-center mb-4">
            <Users className="h-12 w-12 text-pink-500" />
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-3">Community</h3>
          <p className="text-gray-700">
            We foster a sense of community among parents, soft play area owners, and childcare professionals, creating a network of support and shared experiences.
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <div className="flex justify-center mb-4">
            <Award className="h-12 w-12 text-pink-500" />
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-3">Quality</h3>
          <p className="text-gray-700">
            We are committed to providing accurate, up-to-date information about soft play areas, ensuring families can trust our platform when planning their activities.
          </p>
        </div>
      </div>
     
      {/* Coverage */}
      <div className="bg-pink-50 rounded-lg p-8 mb-12">
        <div className="flex items-center mb-6">
          <MapPin className="h-8 w-8 text-pink-500 mr-4" />
          <h2 className="text-2xl font-bold text-gray-800">Our Coverage</h2>
        </div>
        
        <p className="text-lg text-gray-700 mb-6">
          We currently cover major cities and towns across the UK, including:
        </p>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link to="/search?location=London" className="bg-white rounded-lg p-4 text-center hover:shadow-md transition-shadow">
            <span className="font-medium text-gray-800">London</span>
          </Link>
          <Link to="/search?location=Manchester" className="bg-white rounded-lg p-4 text-center hover:shadow-md transition-shadow">
            <span className="font-medium text-gray-800">Manchester</span>
          </Link>
          <Link to="/search?location=Birmingham" className="bg-white rounded-lg p-4 text-center hover:shadow-md transition-shadow">
            <span className="font-medium text-gray-800">Birmingham</span>
          </Link>
          <Link to="/search?location=Edinburgh" className="bg-white rounded-lg p-4 text-center hover:shadow-md transition-shadow">
            <span className="font-medium text-gray-800">Edinburgh</span>
          </Link>
          <Link to="/search?location=Glasgow" className="bg-white rounded-lg p-4 text-center hover:shadow-md transition-shadow">
            <span className="font-medium text-gray-800">Glasgow</span>
          </Link>
          <Link to="/search?location=Leeds" className="bg-white rounded-lg p-4 text-center hover:shadow-md transition-shadow">
            <span className="font-medium text-gray-800">Leeds</span>
          </Link>
          <Link to="/search?location=Liverpool" className="bg-white rounded-lg p-4 text-center hover:shadow-md transition-shadow">
            <span className="font-medium text-gray-800">Liverpool</span>
          </Link>
          <Link to="/search?location=Bristol" className="bg-white rounded-lg p-4 text-center hover:shadow-md transition-shadow">
            <span className="font-medium text-gray-800">Bristol</span>
          </Link>
        </div>
        
        <p className="text-gray-700 mt-6">
          And we're constantly expanding to include more locations!
        </p>
      </div>
      
      {/* CTA */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Join Our Community</h2>
        <p className="text-lg text-gray-700 mb-6">
          Whether you're a parent looking for soft play areas or a venue owner wanting to list your soft play area, we'd love to have you as part of our community.
        </p>
        <div className="flex justify-center space-x-4">
          <Link to="/search" className="bg-pink-500 hover:bg-pink-600 text-white font-bold py-3 px-6 rounded-lg transition duration-200">
            Find Soft Play Areas
          </Link>
          <Link to="/contact" className="bg-white border-2 border-pink-500 text-pink-500 hover:bg-pink-50 font-bold py-3 px-6 rounded-lg transition duration-200">
            Contact Us
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;