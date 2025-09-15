"use client"
import React, { useState } from "react";
import { useAppContext } from "@/context/AppContext";
import { serviceCategories } from "@/assets/assets";

export default function HomePage() {
  const { products } = useAppContext();
  const [selectedCategory, setSelectedCategory] = useState("");
  const [location, setLocation] = useState("");
  const [minRating, setMinRating] = useState("");

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <svg
          key={i}
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`h-4 w-4 ${
            i <= Math.floor(rating)
              ? "text-yellow-400 fill-current"
              : "text-gray-300"
          }`}
        >
          <path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"></path>
        </svg>
      );
    }
    return stars;
  };

  return (
    <div className="relative mbg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 text-white py-16 md:py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-black bg-opacity-10"></div>
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-10 left-10 w-20 h-20 bg-white bg-opacity-10 rounded-full"></div>
          <div className="absolute top-32 right-20 w-16 h-16 bg-white bg-opacity-10 rounded-full"></div>
          <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-white bg-opacity-10 rounded-full"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            Find Local <span className="text-yellow-300">Service Providers</span>
          </h1>
          <p className="text-lg md:text-xl lg:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto leading-relaxed">
            Connect with trusted plumbers, electricians, cleaners, and more in your area. Book services instantly with transparent pricing in Indian Rupees.
          </p>
          
          {/* Search Form */}
          <div className="max-w-5xl mx-auto bg-white rounded-2xl p-4 md:p-6 shadow-2xl">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:border-blue-500 focus:outline-none transition-colors text-sm md:text-base"
              >
                <option value="">🔍 All Categories</option>
                {serviceCategories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              <input
                placeholder="📍 Enter your location"
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:border-blue-500 focus:outline-none transition-colors text-sm md:text-base"
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
              <input
                placeholder="⭐ Min Rating (1-5)"
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:border-blue-500 focus:outline-none transition-colors text-sm md:text-base"
                min="1"
                max="5"
                step="0.1"
                type="number"
                value={minRating}
                onChange={(e) => setMinRating(e.target.value)}
              />
              <button className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-4 py-3 rounded-xl flex items-center justify-center space-x-2 font-semibold shadow-lg transition-all duration-200 transform hover:scale-105 text-sm md:text-base">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4 md:h-5 md:w-5"
                >
                  <path d="m21 21-4.34-4.34"></path>
                  <circle cx="11" cy="11" r="8"></circle>
                </svg>
                <span className="hidden sm:inline">Search Services</span>
                <span className="sm:hidden">Search</span>
              </button>
            </div>
          </div>

          {/* Features */}
          <div className="mt-8 md:mt-12 flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6 lg:space-x-8 text-blue-100">
            <div className="flex items-center space-x-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5 md:h-6 md:w-6 text-green-400"
              >
                <path d="M21.801 10A10 10 0 1 1 17 3.335"></path>
                <path d="m9 11 3 3L22 4"></path>
              </svg>
              <span className="font-semibold text-sm md:text-base">Verified Providers</span>
            </div>
            <div className="flex items-center space-x-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5 md:h-6 md:w-6 text-yellow-400 fill-current"
              >
                <path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"></path>
              </svg>
              <span className="font-semibold text-sm md:text-base">Top Rated Services</span>
            </div>
            <div className="flex items-center space-x-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5 md:h-6 md:w-6 text-blue-300"
              >
                <path d="M12 6v6l4 2"></path>
                <circle cx="12" cy="12" r="10"></circle>
              </svg>
              <span className="font-semibold text-sm md:text-base">Quick Booking</span>
            </div>
          </div>
        </div>
      </div>

      {/* Service Providers Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 md:mb-8 text-center">Available Service Providers</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {products.map((provider) => (
            <div
              key={provider._id}
              className="bg-white rounded-xl shadow-lg p-4 md:p-6 hover:shadow-2xl transition-all duration-300 border-2 border-gray-100 hover:border-blue-200 transform hover:-translate-y-1"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-1 truncate">{provider.businessName}</h3>
                  <p className="text-gray-600 font-medium text-sm md:text-base truncate">{provider.providerName}</p>
                  <div className="flex items-center mt-2 mb-3">
                    <div className="flex items-center space-x-1">
                      {renderStars(provider.rating)}
                    </div>
                    <span className="ml-2 text-xs md:text-sm font-semibold text-gray-700">{provider.rating.toFixed(1)}</span>
                    <span className="text-xs md:text-sm text-gray-500">({provider.reviewCount} reviews)</span>
                  </div>
                </div>
                <div className="bg-gradient-to-r from-green-400 to-green-500 text-white px-2 md:px-3 py-1 rounded-full text-xs md:text-sm font-bold whitespace-nowrap ml-2">
                  ₹{provider.hourlyRate}/hr
                </div>
              </div>
              <p className="text-gray-700 mb-4 text-sm md:text-base line-clamp-2">{provider.description}</p>
              <div className="space-y-2 mb-4">
                <div className="flex items-center space-x-2 text-xs md:text-sm text-gray-600">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4 text-blue-500 flex-shrink-0"
                  >
                    <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                  <span className="font-medium truncate">{provider.location}</span>
                </div>
                <div className="flex items-center space-x-2 text-xs md:text-sm text-gray-600">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4 text-green-500 flex-shrink-0"
                  >
                    <path d="M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384"></path>
                  </svg>
                  <span className="font-medium">{provider.phone}</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-1 md:gap-2 mb-4">
                {provider.categoryNames.map((category, index) => (
                  <span
                    key={index}
                    className="bg-blue-50 text-blue-700 px-2 md:px-3 py-1 rounded-full text-xs font-medium border border-blue-200"
                  >
                    {category}
                  </span>
                ))}
              </div>
              <a
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-2 md:py-3 px-4 rounded-lg text-center block transition-all duration-200 font-semibold shadow-md hover:shadow-lg text-sm md:text-base"
                href={`/provider/${provider._id}`}
              >
                View Details & Book Service
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
