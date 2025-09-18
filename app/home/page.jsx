"use client"
import React, { useState } from "react";
import { useAppContext } from "@/context/AppContext";
// Categories aligned with ServiceProvider schema enums
const schemaCategories = [
  { id: "plumber", name: "🔧 Plumbing" },
  { id: "electrician", name: "⚡ Electrical" },
  { id: "cleaner", name: "🧹 Cleaning" },
  { id: "carpenter", name: "🔨 Carpentry" },
  { id: "painter", name: "🎨 Painting" },
  { id: "mechanic", name: "🔧 Mechanic" },
  { id: "gardener", name: "🌱 Gardening" },
  { id: "appliance-repair", name: "🧰 Appliance Repair" },
  { id: "pest-control", name: "🐜 Pest Control" },
  { id: "ac-repair", name: "❄️ AC Repair" },
  { id: "home-security", name: "🔒 Home Security" },
  { id: "other", name: "➕ Other" },
];

export default function HomePage() {
  const { products } = useAppContext();
  const [selectedCategory, setSelectedCategory] = useState("");
  const [location, setLocation] = useState("");
  const [minRating, setMinRating] = useState("");
  const [displayed, setDisplayed] = useState(products || []);

  // Keep displayed list in sync with context on initial load
  React.useEffect(() => {
    setDisplayed(products || []);
  }, [products]);

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
            i <= Math.floor(rating || 0)
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

  const handleSearch = async () => {
    try {
      const params = new URLSearchParams();
      if (selectedCategory) params.set("category", selectedCategory);
      if (minRating) params.set("minRating", String(minRating));
      if (location) params.set("city", location);
      const url = `/api/service-provider/list${params.toString() ? `?${params.toString()}` : ""}`;
      const res = await fetch(url, { cache: 'no-store' });
      if (!res.ok) {
        console.error('Search fetch failed');
        return;
      }
      const json = await res.json();
      const data = json?.data || [];
      setDisplayed(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error('Search error', e);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 text-white py-20 md:py-24 lg:py-28 relative overflow-hidden">
        <div className="absolute inset-0 bg-black bg-opacity-10"></div>
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-10 left-10 w-20 h-20 bg-white bg-opacity-10 rounded-full animate-pulse"></div>
          <div className="absolute top-32 right-20 w-16 h-16 bg-white bg-opacity-10 rounded-full animate-pulse delay-100"></div>
          <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-white bg-opacity-10 rounded-full animate-pulse delay-200"></div>
          <div className="absolute top-1/2 right-1/3 w-8 h-8 bg-white bg-opacity-5 rounded-full animate-pulse delay-300"></div>
        </div>
        <div className="container mx-auto px-6 sm:px-8 lg:px-12 xl:px-16 text-center relative z-10 max-w-6xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold mb-8 leading-tight tracking-tight">
            Find Local <span className="text-yellow-300 drop-shadow-lg">Service Providers</span>
          </h1>
          <p className="text-lg md:text-xl lg:text-2xl mb-12 text-blue-100 max-w-4xl mx-auto leading-relaxed font-light">
            Connect with trusted plumbers, electricians, cleaners, and more in your area. Book services instantly with transparent pricing in Indian Rupees.
          </p>
          
          {/* Search Form */}
          <div className="max-w-6xl mx-auto bg-white/95 backdrop-blur-sm rounded-3xl p-6 md:p-8 shadow-2xl border border-white/20">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-4 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all duration-200 text-sm md:text-base font-medium bg-gray-50 hover:bg-white"
              >
                <option value="">🔍 All Categories</option>
                {schemaCategories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              <input
                placeholder="📍 Enter your location"
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-4 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all duration-200 text-sm md:text-base font-medium bg-gray-50 hover:bg-white"
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
              <input
                placeholder="⭐ Min Rating (1-5)"
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-4 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all duration-200 text-sm md:text-base font-medium bg-gray-50 hover:bg-white"
                min="1"
                max="5"
                step="0.1"
                type="number"
                value={minRating}
                onChange={(e) => setMinRating(e.target.value)}
              />
              <button onClick={handleSearch} className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-4 py-4 rounded-xl flex items-center justify-center space-x-2 font-bold shadow-xl transition-all duration-200 transform hover:scale-105 hover:shadow-2xl text-sm md:text-base">
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
          <div className="mt-12 md:mt-16 flex flex-col sm:flex-row justify-center items-center space-y-6 sm:space-y-0 sm:space-x-8 lg:space-x-12 text-blue-100">
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
      <div className="container mx-auto px-6 sm:px-8 lg:px-12 xl:px-16 py-16 md:py-20 max-w-7xl">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">Available Service Providers</h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">Discover trusted professionals in your area with verified ratings and transparent pricing</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {displayed.map((provider) => (
            <div
              key={provider._id}
              className="bg-white rounded-2xl shadow-lg p-6 md:p-8 hover:shadow-2xl transition-all duration-300 border border-gray-200 hover:border-blue-300 transform hover:-translate-y-2 hover:scale-[1.02] group"
            >
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1 min-w-0">
                  <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2 truncate group-hover:text-blue-600 transition-colors">{provider.businessName}</h3>
                  {provider.description && (
                    <p className="text-gray-600 text-sm md:text-base truncate">{provider.description}</p>
                  )}
                  <div className="flex items-center mt-2 mb-3">
                    <div className="flex items-center space-x-1">
                      {renderStars(provider?.rating?.average)}
                    </div>
                    <span className="ml-2 text-xs md:text-sm font-semibold text-gray-700">{Number(provider?.rating?.average || 0).toFixed(1)}</span>
                    <span className="text-xs md:text-sm text-gray-500">({provider?.rating?.count || 0} reviews)</span>
                  </div>
                </div>
                <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 rounded-full text-sm md:text-base font-bold whitespace-nowrap ml-4 shadow-lg">
                  ₹{provider?.pricing?.hourlyRate ?? 0}/hr
                </div>
              </div>
              <p className="text-gray-700 mb-6 text-base md:text-lg line-clamp-3 leading-relaxed">{provider.description}</p>
              <div className="space-y-3 mb-6">
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
                  <span className="font-medium truncate">{provider?.serviceAreas?.[0]?.areaName || 'Available in your city'}</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 md:gap-3 mb-6">
                {(provider.categories || []).map((category, index) => (
                  <span
                    key={index}
                    className="bg-blue-50 text-blue-700 px-3 md:px-4 py-2 rounded-full text-sm font-semibold border border-blue-200 hover:bg-blue-100 transition-colors"
                  >
                    {String(category).replace('-', ' ')}
                  </span>
                ))}
              </div>
              <a
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-4 px-6 rounded-xl text-center block transition-all duration-200 font-bold shadow-lg hover:shadow-xl text-base md:text-lg transform hover:scale-[1.02]"
                href={`/product/${provider._id}`}
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
