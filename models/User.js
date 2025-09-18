import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    _id: { type: String, required: true }, // Clerk user ID
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    imageUrl: { type: String, required: true },
    phone: { type: String },
    role: { 
        type: String, 
        enum: ['user', 'serviceProvider', 'admin'], 
        default: 'user' 
    },
    isVerified: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    
    // Location data
    location: {
        address: { type: String },
        city: { type: String },
        state: { type: String },
        pincode: { type: String },
        coordinates: {
            type: { type: String, enum: ['Point'] },
            coordinates: { type: [Number] } // [longitude, latitude]
        }
    },
    
    // Wallet functionality
    wallet: {
        balance: { type: Number, default: 0 },
        currency: { type: String, default: 'INR' }
    },
    
    // User preferences
    preferences: {
        notifications: {
            email: { type: Boolean, default: true },
            sms: { type: Boolean, default: true },
            push: { type: Boolean, default: true }
        },
        language: { type: String, default: 'en' }
    },
    
    // Metadata
    lastLogin: { type: Date }
}, { 
    minimize: false,
    timestamps: true 
});

// Indexes for performance
userSchema.index({ role: 1 });
// Geospatial index: include only docs with valid GeoJSON structure
userSchema.index(
    { "location.coordinates": "2dsphere" },
    {
        sparse: true,
        partialFilterExpression: {
            "location.coordinates.type": "Point",
            "location.coordinates.coordinates": { $type: "array" }
        }
    }
);
userSchema.index({ isActive: 1 });

// Strip invalid/empty location structures to avoid inserting partial GeoJSON
userSchema.pre('save', function(next) {
    if (this.location) {
        const loc = this.location;
        const hasAddress = !!(loc.address || loc.city || loc.state || loc.pincode);
        const geo = loc.coordinates;
        const validGeo = geo && geo.type === 'Point' && Array.isArray(geo.coordinates) && geo.coordinates.length === 2 &&
            typeof geo.coordinates[0] === 'number' && typeof geo.coordinates[1] === 'number';

        // If coordinates object exists but invalid, remove it
        if (geo && !validGeo) {
            delete loc.coordinates;
        }

        // If nothing left in location, remove location entirely
        const stillHasGeo = loc.coordinates && loc.coordinates.type === 'Point' && Array.isArray(loc.coordinates.coordinates);
        if (!hasAddress && !stillHasGeo) {
            this.location = undefined;
        }
    }
    next();
});

const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;