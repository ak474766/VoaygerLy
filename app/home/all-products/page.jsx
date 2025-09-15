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
    <div className="flex flex-col items-start">
      <div className="flex flex-col items-end pt-2">
        <p className="text-2xl font-medium">Available Service Providers</p>
        <div className="w-16 h-0.5 bg-orange-600 rounded-full" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8 pb-14 w-full">
        {products.map((provider) => (
          <div
            key={provider._id}
            className="bg-white rounded-xl shadow-lg p-6 hover:shadow-2xl transition-all duration-300 border-2 border-gray-100 hover:border-blue-200 transform hover:-translate-y-1"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 mb-1">{provider.businessName}</h3>
                <p className="text-gray-600 font-medium">{provider.providerName}</p>
                <div className="flex items-center mt-2 mb-3">
                  <div className="flex items-center space-x-1">
                    {renderStars(provider.rating)}
                  </div>
                  <span className="ml-2 text-sm font-semibold text-gray-700">{provider.rating.toFixed(1)}</span>
                  <span className="text-sm text-gray-500">({provider.reviewCount} reviews)</span>
                </div>
              </div>
              <div className="bg-gradient-to-r from-green-400 to-green-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                ₹{provider.hourlyRate}/hr
              </div>
            </div>
            <p className="text-gray-700 mb-4 line-clamp-2">{provider.description}</p>
            <div className="space-y-2 mb-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
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
                  className="h-4 w-4 text-blue-500"
                >
                  <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
                <span className="font-medium">{provider.location}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
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
                  className="h-4 w-4 text-green-500"
                >
                  <path d="M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384"></path>
                </svg>
                <span className="font-medium">{provider.phone}</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 mb-4">
              {provider.categoryNames.map((category, index) => (
                <span
                  key={index}
                  className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-medium border border-blue-200"
                >
                  {category}
                </span>
              ))}
            </div>
            <a
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-3 px-4 rounded-lg text-center block transition-all duration-200 font-semibold shadow-md hover:shadow-lg"
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
