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
            type: { type: String, enum: ['Point'] },
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
    
}, { 
    minimize: false,
    timestamps: true 
});

// Indexes for performance
serviceProviderSchema.index({ userId: 1 });
serviceProviderSchema.index({ categories: 1 });
// Make geospatial index sparse so providers without coordinates don't throw indexing errors
serviceProviderSchema.index({ "serviceAreas.location": "2dsphere" }, { sparse: true });
serviceProviderSchema.index({ "rating.average": -1 });
serviceProviderSchema.index({ "pricing.hourlyRate": 1 });
serviceProviderSchema.index({ isActive: 1, isVerified: 1 });
serviceProviderSchema.index({ verificationStatus: 1 });

// Remove invalid geospatial entries to avoid partial GeoJSON
serviceProviderSchema.pre('save', function(next) {
    if (Array.isArray(this.serviceAreas)) {
        this.serviceAreas = this.serviceAreas.filter(sa => {
            if (!sa || !sa.location) return false;
            const loc = sa.location;
            const valid = loc && loc.type === 'Point' && Array.isArray(loc.coordinates) && loc.coordinates.length === 2 &&
                typeof loc.coordinates[0] === 'number' && typeof loc.coordinates[1] === 'number';
            return valid;
        });
    }
    next();
});

const ServiceProvider = mongoose.models.ServiceProvider || mongoose.model('ServiceProvider', serviceProviderSchema);

export default ServiceProvider;

