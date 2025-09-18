# 🚀 Voyagerly - Service Provider Marketplace

A comprehensive service provider marketplace built with Next.js, MongoDB, and Clerk authentication. Connect customers with local service providers like plumbers, electricians, cleaners, and more.

## ✨ Features

### 🏠 **Customer Features**
- **Search & Discovery**: Find service providers by category, location, and ratings
- **Geospatial Search**: Location-based search with radius filtering
- **Service Booking**: Complete booking flow with COD payment
- **Real-time Messaging**: Contact providers directly
- **Review System**: Rate and review completed services
- **Order Management**: Track booking status and history

### 🔧 **Service Provider Features**
- **Complete Onboarding**: Business profile setup with photos and service areas
- **Booking Management**: Accept, decline, start, and complete bookings
- **Dashboard Analytics**: View stats, earnings, and performance metrics
- **Review Management**: View and respond to customer reviews
- **Service Area Management**: Define coverage areas with geolocation
- **Photo Gallery**: Upload and manage service photos

### 👑 **Admin Features**
- **Platform Overview**: Comprehensive statistics and analytics
- **Provider Verification**: Approve/reject service provider applications
- **User Management**: Manage user roles and permissions
- **Content Moderation**: Review and moderate platform content

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19, Tailwind CSS
- **Backend**: Next.js API Routes, MongoDB with Mongoose
- **Authentication**: Clerk
- **File Upload**: Cloudinary
- **Maps & Location**: Geospatial queries with MongoDB
- **UI Components**: Custom components with Tailwind CSS
- **State Management**: React Context API

## 📋 Prerequisites

- Node.js 18+ and npm
- MongoDB database
- Clerk account for authentication
- Cloudinary account for image uploads

## ⚡ Quick Start

### 1. Clone and Install
```bash
git clone <your-repo-url>
cd voyagerly
npm install
```

### 2. Environment Setup
Create `.env.local` file:
```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

# Database
MONGODB_URI=your_mongodb_connection_string

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# App Configuration
NEXT_PUBLIC_CURRENCY=₹
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Start Development Server
```bash
npm run dev
```

Visit `http://localhost:3000` to see your marketplace!

## 🎯 Testing Guide

### Step 1: Create Admin User
1. Sign up at `/sign-up`
2. Update user role in MongoDB:
   ```javascript
   db.users.updateOne(
     { email: "admin@example.com" },
     { $set: { role: "admin" } }
   )
   ```

### Step 2: Create Service Providers
1. Sign up with different emails
2. Complete provider setup at `/service-provider/setup`
3. Add photos, service areas, and business details

### Step 3: Admin Verification
1. Login as admin
2. Go to `/admin/dashboard`
3. Navigate to "Providers" tab
4. Approve pending providers

### Step 4: Test Customer Flow
1. Sign up as customer
2. Search for services on home page
3. Book a service with COD payment
4. Contact provider via messaging

### Step 5: Test Provider Flow
1. Login as service provider
2. Go to `/service-provider/dashboard`
3. Accept booking → Start service → Complete
4. View reviews and stats

## 🔧 API Endpoints

### Service Providers
```
GET    /api/service-provider/list          # List providers with filters
GET    /api/service-provider/detail        # Get provider details
POST   /api/service-provider/register      # Create/update provider profile
```

### Bookings
```
POST   /api/bookings/quick                 # Create booking
GET    /api/bookings/my                    # Get user's bookings
POST   /api/bookings/manage                # Update booking status
```

### Reviews
```
GET    /api/reviews                        # Get reviews for provider
POST   /api/reviews                        # Create review
```

### Admin
```
GET    /api/admin/stats                    # Platform statistics
GET    /api/admin/providers                # List providers for verification
PUT    /api/admin/providers                # Update provider status
```

### File Upload
```
POST   /api/upload                         # Generate signed upload URL
PUT    /api/upload                         # Direct file upload
DELETE /api/upload                         # Delete uploaded file
```

## 🗺️ Geospatial Search

The platform supports location-based search using MongoDB's geospatial features:

```javascript
// Search by coordinates
GET /api/service-provider/list?lat=19.1358&lng=72.8347&radius=5000

// Search by city (fallback)
GET /api/service-provider/list?city=Mumbai

// Combined search
GET /api/service-provider/list?category=plumber&lat=19.1358&lng=72.8347&radius=10000
```

## 💳 Payment System

Currently implements **Cash on Delivery (COD)** for development:
- Booking creation with COD option
- Payment status tracking
- Automatic payment completion on service completion
- Ready for Razorpay integration (credentials in env)

## 📱 Responsive Design

Fully responsive design with Tailwind CSS:
- Mobile-first approach
- Tablet and desktop optimized
- Touch-friendly interfaces
- Accessible components

## 🔐 Security Features

- **Authentication**: Clerk-based secure authentication
- **Authorization**: Role-based access control (user/serviceProvider/admin)
- **API Security**: Protected routes with middleware
- **Data Validation**: Input validation on all endpoints
- **File Upload Security**: Cloudinary integration with signed URLs

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on git push

### Other Platforms
- Ensure Node.js 18+ support
- Set all environment variables
- Configure MongoDB connection
- Update CORS settings if needed

## 📊 Database Schema

### User Model
- Basic info with roles (user, serviceProvider, admin)
- Wallet functionality
- Location data with GeoJSON support

### ServiceProvider Model
- Business information and categories
- Pricing and availability
- Service areas with geospatial data
- Photos and documents
- Rating and statistics

### Booking Model
- Complete booking lifecycle
- Payment tracking
- Location and scheduling
- Status timeline

### Review Model
- Rating system with detailed ratings
- Moderation support
- Helpfulness tracking

### Message Model
- Real-time messaging between users
- Booking-scoped conversations
- Media support

### Transaction Model
- Financial transaction tracking
- Multiple payment methods
- Wallet and gateway support

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Check the troubleshooting section
- Review API documentation
- Create an issue on GitHub

---

**Happy coding! 🎉**
