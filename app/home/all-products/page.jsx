"use client"
import React from "react";
import { useAppContext } from "@/context/AppContext";

export default function AllProductsAuth() {
  const { products } = useAppContext();

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
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-7xl">
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">All Service Providers</h1>
        <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-6">Browse through our complete collection of verified service providers</p>
        <div className="w-24 h-1 bg-gradient-to-r from-orange-500 to-red-500 rounded-full mx-auto" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
        {products.map((provider) => (
          <div
            key={provider._id}
            className="bg-white rounded-2xl shadow-lg p-6 md:p-8 hover:shadow-2xl transition-all duration-300 border border-gray-200 hover:border-blue-300 transform hover:-translate-y-2 hover:scale-[1.02] group"
          >
            <div className="flex items-start justify-between mb-6">
              <div className="flex-1 min-w-0">
                <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2 truncate group-hover:text-blue-600 transition-colors">{provider.businessName}</h3>
                <p className="text-gray-600 font-semibold text-base md:text-lg truncate">{provider.providerName}</p>
                <div className="flex items-center mt-2 mb-3">
                  <div className="flex items-center space-x-1">
                    {renderStars(provider.rating)}
                  </div>
                  <span className="ml-2 text-xs md:text-sm font-semibold text-gray-700">{provider.rating.toFixed(1)}</span>
                  <span className="text-xs md:text-sm text-gray-500">({provider.reviewCount} reviews)</span>
                </div>
              </div>
              <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 rounded-full text-sm md:text-base font-bold whitespace-nowrap ml-4 shadow-lg">
                ₹{provider.hourlyRate}/hr
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
            <div className="flex flex-wrap gap-2 md:gap-3 mb-6">
              {provider.categoryNames.map((category, index) => (
                <span
                  key={index}
                  className="bg-blue-50 text-blue-700 px-3 md:px-4 py-2 rounded-full text-sm font-semibold border border-blue-200 hover:bg-blue-100 transition-colors"
                >
                  {category}
                </span>
              ))}
            </div>
            <a
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-4 px-6 rounded-xl text-center block transition-all duration-200 font-bold shadow-lg hover:shadow-xl text-base md:text-lg transform hover:scale-[1.02]"
              href={`/provider/${provider._id}`}
            >
              View Details & Book Service
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
