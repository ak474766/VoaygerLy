import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema({
    serviceId: { 
        type: String, 
        required: true, 
        unique: true,
        default: () => `SRV${Date.now()}${Math.random().toString(36).substr(2, 4).toUpperCase()}`
    },
    
    // Service Provider Info
    serviceProviderId: { type: String, required: true, ref: 'ServiceProvider' },
    
    // Service Details
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { 
        type: String, 
        required: true,
        enum: [
            'plumber', 'electrician', 'cleaner', 'carpenter', 
            'painter', 'mechanic', 'gardener', 'appliance-repair',
            'pest-control', 'ac-repair', 'home-security', 'other'
        ]
    },
    subcategory: { type: String },
    
    // Pricing
    pricing: {
        type: { 
            type: String, 
            enum: ['hourly', 'fixed', 'both'], 
            required: true 
        },
        hourlyRate: { type: Number },
        fixedPrice: { type: Number },
        currency: { type: String, default: 'INR' },
        minimumCharge: { type: Number }
    },
    
    // Service Areas
    serviceAreas: [{
        city: { type: String, required: true },
        areas: [{ type: String }],
        radiusKm: { type: Number, default: 10 }
    }],
    
    // Media
    images: [{ type: String }], // URLs
    videos: [{ type: String }], // URLs
    
    // Availability
    availability: {
        isAvailable: { type: Boolean, default: true },
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
        advanceBookingDays: { type: Number, default: 30 }
    },
    
    // Features & Requirements
    features: [{ type: String }],
    requirements: [{ type: String }],
    tools: [{ type: String }],
    
    // Ratings & Reviews
    rating: {
        average: { type: Number, default: 0, min: 0, max: 5 },
        count: { type: Number, default: 0 }
    },
    
    // Status
    status: {
        type: String,
        enum: ['active', 'inactive', 'pending', 'rejected'],
        default: 'pending'
    },
    
    // Statistics
    stats: {
        totalBookings: { type: Number, default: 0 },
        completedBookings: { type: Number, default: 0 },
        views: { type: Number, default: 0 },
        inquiries: { type: Number, default: 0 }
    },
    
    // SEO & Search
    tags: [{ type: String }],
    searchKeywords: [{ type: String }],
    
    // Metadata
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
}, { 
    minimize: false,
    timestamps: true 
});

// Indexes for performance
serviceSchema.index({ serviceProviderId: 1 });
serviceSchema.index({ category: 1 });
serviceSchema.index({ status: 1 });
serviceSchema.index({ "rating.average": -1 });
serviceSchema.index({ "pricing.hourlyRate": 1 });
serviceSchema.index({ "pricing.fixedPrice": 1 });
serviceSchema.index({ tags: 1 });
serviceSchema.index({ createdAt: -1 });

// Update the updatedAt field before saving
serviceSchema.pre('save', function(next) {
    this.updatedAt = new Date();
    next();
});

const Service = mongoose.models.Service || mongoose.model('Service', serviceSchema);

export default Service;
