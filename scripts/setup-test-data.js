// Test data setup script for Voyagerly Service Provider Marketplace
// Run this after setting up your first admin user to populate test data

const testProviders = [
  {
    businessName: "Mumbai Plumbing Experts",
    description: "Professional plumbing services with 10+ years experience. Available 24/7 for emergency repairs.",
    categories: ["plumber"],
    skills: ["Pipe Repair", "Leak Detection", "Bathroom Fitting", "Kitchen Plumbing"],
    pricing: {
      type: "hourly",
      hourlyRate: 500,
      currency: "INR"
    },
    serviceAreas: [
      {
        areaName: "Andheri West",
        radiusKm: 5,
        location: {
          type: "Point",
          coordinates: [72.8347, 19.1358] // Mumbai coordinates
        }
      }
    ],
    availability: {
      workingDays: [
        { day: "monday", startTime: "09:00", endTime: "18:00", isAvailable: true },
        { day: "tuesday", startTime: "09:00", endTime: "18:00", isAvailable: true },
        { day: "wednesday", startTime: "09:00", endTime: "18:00", isAvailable: true },
        { day: "thursday", startTime: "09:00", endTime: "18:00", isAvailable: true },
        { day: "friday", startTime: "09:00", endTime: "18:00", isAvailable: true },
        { day: "saturday", startTime: "10:00", endTime: "16:00", isAvailable: true }
      ],
      timeSlotDuration: 60,
      advanceBookingDays: 30
    }
  },
  {
    businessName: "Delhi Electrical Solutions",
    description: "Certified electricians for all your electrical needs. Safety is our priority.",
    categories: ["electrician"],
    skills: ["Wiring", "Panel Installation", "LED Setup", "Electrical Repair"],
    pricing: {
      type: "hourly",
      hourlyRate: 600,
      currency: "INR"
    },
    serviceAreas: [
      {
        areaName: "Connaught Place",
        radiusKm: 10,
        location: {
          type: "Point",
          coordinates: [77.2167, 28.6289] // Delhi coordinates
        }
      }
    ],
    availability: {
      workingDays: [
        { day: "monday", startTime: "08:00", endTime: "17:00", isAvailable: true },
        { day: "tuesday", startTime: "08:00", endTime: "17:00", isAvailable: true },
        { day: "wednesday", startTime: "08:00", endTime: "17:00", isAvailable: true },
        { day: "thursday", startTime: "08:00", endTime: "17:00", isAvailable: true },
        { day: "friday", startTime: "08:00", endTime: "17:00", isAvailable: true }
      ],
      timeSlotDuration: 60,
      advanceBookingDays: 30
    }
  },
  {
    businessName: "Bangalore Home Cleaners",
    description: "Professional home cleaning services. Eco-friendly products and trained staff.",
    categories: ["cleaner"],
    skills: ["Deep Cleaning", "Regular Maintenance", "Kitchen Cleaning", "Bathroom Sanitization"],
    pricing: {
      type: "hourly",
      hourlyRate: 300,
      currency: "INR"
    },
    serviceAreas: [
      {
        areaName: "Koramangala",
        radiusKm: 8,
        location: {
          type: "Point",
          coordinates: [77.6309, 12.9279] // Bangalore coordinates
        }
      }
    ],
    availability: {
      workingDays: [
        { day: "monday", startTime: "09:00", endTime: "18:00", isAvailable: true },
        { day: "tuesday", startTime: "09:00", endTime: "18:00", isAvailable: true },
        { day: "wednesday", startTime: "09:00", endTime: "18:00", isAvailable: true },
        { day: "thursday", startTime: "09:00", endTime: "18:00", isAvailable: true },
        { day: "friday", startTime: "09:00", endTime: "18:00", isAvailable: true },
        { day: "saturday", startTime: "09:00", endTime: "15:00", isAvailable: true }
      ],
      timeSlotDuration: 120,
      advanceBookingDays: 15
    }
  }
];

// Instructions for manual setup:
console.log(`
🚀 VOYAGERLY MARKETPLACE SETUP GUIDE
====================================

1. START THE APPLICATION:
   npm run dev

2. CREATE ADMIN USER:
   - Sign up at http://localhost:3000/sign-up
   - After signup, manually update the user role in MongoDB:
     db.users.updateOne(
       { email: "your-admin-email@example.com" },
       { $set: { role: "admin" } }
     )

3. CREATE TEST SERVICE PROVIDERS:
   - Sign up with different email addresses
   - Complete the provider setup form at /service-provider/setup
   - Use the test data above as reference

4. VERIFY PROVIDERS (as admin):
   - Login as admin
   - Go to /admin/dashboard
   - Navigate to "Providers" tab
   - Approve pending providers

5. TEST THE COMPLETE FLOW:
   - Search for services on home page
   - Book a service
   - As provider: accept booking → start → complete
   - As customer: write a review

6. TEST GEOSPATIAL SEARCH:
   - Use coordinates in search: lat=19.1358&lng=72.8347&radius=5000
   - Example: /api/service-provider/list?lat=19.1358&lng=72.8347&radius=5000

📋 TEST SCENARIOS:
================

Scenario 1: Customer Journey
- Sign up as customer
- Search for "plumber" in Mumbai
- Book Mumbai Plumbing Experts
- Contact via messaging
- Complete booking and write review

Scenario 2: Provider Journey  
- Sign up as service provider
- Complete setup with photos and service areas
- Wait for admin approval
- Accept bookings and manage services

Scenario 3: Admin Journey
- Login as admin
- Review platform statistics
- Verify pending providers
- Monitor platform activity

🔧 TROUBLESHOOTING:
==================

If you encounter issues:
1. Check MongoDB connection in .env
2. Verify Clerk keys are correct
3. Ensure Cloudinary credentials are set
4. Check console for API errors

📊 SAMPLE API CALLS:
===================

# Get all providers
GET /api/service-provider/list

# Search by location
GET /api/service-provider/list?lat=19.1358&lng=72.8347&radius=5000

# Search by category
GET /api/service-provider/list?category=plumber

# Get provider details
GET /api/service-provider/detail?id=PROVIDER_ID

# Create booking (authenticated)
POST /api/bookings/quick

# Get reviews
GET /api/reviews?providerId=PROVIDER_ID

Your marketplace is ready! 🎉
`);

module.exports = { testProviders };
