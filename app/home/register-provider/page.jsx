"use client"
import React, { useState } from "react";
import axios from "axios";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export default function RegisterProvider() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    businessName: "",
    description: "",
    location: "",
    pricingType: "hourly",
    baseRate: "",
    categories: []
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  // Must match ServiceProvider schema enums
  const serviceCategories = [
    { id: "plumber", label: "🔧 Plumbing" },
    { id: "electrician", label: "⚡ Electrical" },
    { id: "cleaner", label: "🧹 Cleaning" },
    { id: "carpenter", label: "🔨 Carpentry" },
    { id: "painter", label: "🎨 Painting" },
    { id: "mechanic", label: "🔧 Mechanic" },
    { id: "gardener", label: "🌱 Gardening" },
    { id: "appliance-repair", label: "🧰 Appliance Repair" },
    { id: "pest-control", label: "🐜 Pest Control" },
    { id: "ac-repair", label: "❄️ AC Repair" },
    { id: "home-security", label: "🔒 Home Security" },
    { id: "other", label: "➕ Other" },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCategoryChange = (categoryId) => {
    setFormData(prev => ({
      ...prev,
      categories: prev.categories.includes(categoryId)
        ? prev.categories.filter(id => id !== categoryId)
        : [...prev.categories, categoryId]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage("");

    try {
      // Build payload that matches /api/service-provider/register
      const payload = {
        businessName: formData.businessName,
        description: formData.description,
        categories: formData.categories,
        skills: [],
        pricing: {
          type: formData.pricingType, // 'hourly' | 'fixed' | 'both'
          hourlyRate: formData.baseRate ? Number(formData.baseRate) : undefined,
          currency: 'INR',
        },
        serviceAreas: formData.location ? [{ areaName: formData.location }] : [],
        availability: {
          workingDays: [],
          timeSlotDuration: 60,
          advanceBookingDays: 30,
        },
      };

      const response = await axios.post("/api/service-provider/register", payload);
      setMessage("Registration successful! Redirecting to dashboard...");
      // Redirect to provider dashboard
      router.push('/service-provider/dashboard');
    } catch (error) {
      const apiMsg = error?.response?.data?.error || error?.response?.data?.message;
      setMessage(apiMsg || "Registration failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
            Register as Service Provider
          </h2>
          <p className="text-lg text-gray-600">
            Join our platform and start growing your business
          </p>
        </div>

        <SignedOut>
          <div className="mb-6 p-4 rounded-lg bg-yellow-50 text-yellow-800 border border-yellow-200">
            Please sign in first to register as a service provider.
          </div>
        </SignedOut>

        {message && (
          <div className={`mb-6 p-4 rounded-lg ${message.includes("successful") 
            ? "bg-green-50 text-green-700 border border-green-200" 
            : "bg-red-50 text-red-700 border border-red-200"
          }`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white shadow-xl rounded-2xl p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input
              required
              name="businessName"
              placeholder="Business Name"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              type="text"
              value={formData.businessName}
              onChange={handleInputChange}
            />
            <input
              name="location"
              placeholder="Service Location (City, State)"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              type="text"
              value={formData.location}
              onChange={handleInputChange}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <select
              name="pricingType"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              value={formData.pricingType}
              onChange={handleInputChange}
            >
              <option value="hourly">Hourly Rate</option>
              <option value="fixed">Fixed Price</option>
              <option value="both">Both</option>
            </select>
            <input
              required
              name="baseRate"
              placeholder="Base Rate (₹)"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              min="0"
              step="0.01"
              type="number"
              value={formData.baseRate}
              onChange={handleInputChange}
            />
          </div>

          <textarea
            required
            name="description"
            placeholder="Business Description"
            rows="4"
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
            value={formData.description}
            onChange={handleInputChange}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Reserved for future fields */}
            <div></div>
            <div></div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-4">
              Select Your Service Categories
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {serviceCategories.map((category) => (
                <label key={category.id} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                  <input
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 w-4 h-4"
                    type="checkbox"
                    checked={formData.categories.includes(category.id)}
                    onChange={() => handleCategoryChange(category.id)}
                  />
                  <span className="text-sm font-medium">{category.label}</span>
                </label>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-4 px-6 rounded-xl disabled:opacity-50 font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02]"
          >
            {isSubmitting ? "Registering..." : "Register as Provider"}
          </button>
        </form>
      </div>
    </div>
  );
}
