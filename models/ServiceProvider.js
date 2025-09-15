import mongoose from "mongoose";

const serviceProviderSchema = new mongoose.Schema({
    userId: { 
        type: String, 
        required: true, 
        ref: 'User',
        unique: true 
    },
    
    // Business Information
    businessName: { type: String, required: true },
    description: { type: String, required: true },
    categories: [{ 
        type: String, 
        required: true,
        enum: [
            'plumber', 'electrician', 'cleaner', 'carpenter', 
            'painter', 'mechanic', 'gardener', 'appliance-repair',
            'pest-control', 'ac-repair', 'home-security', 'other'
        ]
    }],
    skills: [{ type: String }],
    
    // Pricing
    pricing: {
        type: { 
            type: String, 
            enum: ['hourly', 'fixed', 'both'], 
            default: 'hourly' 
        },
        hourlyRate: { type: Number },
        fixedRates: [{
            service: { type: String },
            price: { type: Number },
            description: { type: String }
        }],
        currency: { type: String, default: 'INR' }
    },
    
    // Service Areas (geospatial)
    serviceAreas: [{
        location: {
            type: { type: String, enum: ['Point'], default: 'Point' },
            coordinates: { type: [Number] } // [longitude, latitude]
        },
        radiusKm: { type: Number, default: 10 },
        areaName: { type: String }
    }],
    
    // Availability
    availability: {
        workingDays: [{
            day: { 
                type: String, 
                enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] 
            },
            startTime: { type: String }, // "09:00"
            endTime: { type: String },   // "18:00"
            isAvailable: { type: Boolean, default: true }
        }],
        timeSlotDuration: { type: Number, default: 60 }, // minutes
        advanceBookingDays: { type: Number, default: 30 },
        breakTime: {
            start: { type: String }, // "13:00"
            end: { type: String }    // "14:00"
        }
    },
    
    // Media
    photos: [{ type: String }], // URLs
    documents: [{
        type: { type: String, enum: ['license', 'certificate', 'id-proof', 'other'] },
        url: { type: String },
        verified: { type: Boolean, default: false }
    }],
    
    // Ratings & Reviews
    rating: {
        average: { type: Number, default: 0, min: 0, max: 5 },
        count: { type: Number, default: 0 }
    },
    
    // Status & Verification
    isVerified: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    verificationStatus: {
        type: String,
        enum: ['pending', 'in-review', 'verified', 'rejected'],
        default: 'pending'
    },
    
    // Statistics
    stats: {
        totalBookings: { type: Number, default: 0 },
        completedBookings: { type: Number, default: 0 },
        cancelledBookings: { type: Number, default: 0 },
        totalEarnings: { type: Number, default: 0 },
        responseTime: { type: Number, default: 0 }, // minutes
        joinedDate: { type: Date, default: Date.now }
    },
    
    // Settings
    settings: {
        autoAcceptBookings: { type: Boolean, default: false },
        instantBooking: { type: Boolean, default: true },
        cancellationPolicy: {
            type: String,
            enum: ['flexible', 'moderate', 'strict'],
            default: 'moderate'
        }
    },
    
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
}, { 
    minimize: false,
    timestamps: true 
});

// Indexes for performance
serviceProviderSchema.index({ userId: 1 });
serviceProviderSchema.index({ categories: 1 });
serviceProviderSchema.index({ "serviceAreas.location": "2dsphere" });
serviceProviderSchema.index({ "rating.average": -1 });
serviceProviderSchema.index({ "pricing.hourlyRate": 1 });
serviceProviderSchema.index({ isActive: 1, isVerified: 1 });
serviceProviderSchema.index({ verificationStatus: 1 });

// Update the updatedAt field before saving
serviceProviderSchema.pre('save', function(next) {
    this.updatedAt = new Date();
    next();
});

const ServiceProvider = mongoose.models.ServiceProvider || mongoose.model('ServiceProvider', serviceProviderSchema);

export default ServiceProvider;
