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
            type: { type: String, enum: ['Point'], default: 'Point' },
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
    lastLogin: { type: Date },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
}, { 
    minimize: false,
    timestamps: true 
});

// Indexes for performance
userSchema.index({ email: 1 });
userSchema.index({ role: 1 });
userSchema.index({ "location.coordinates": "2dsphere" });
userSchema.index({ isActive: 1 });

// Update the updatedAt field before saving
userSchema.pre('save', function(next) {
    this.updatedAt = new Date();
    next();
});

const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;