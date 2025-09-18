import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
    bookingId: { 
        type: String, 
        required: true, 
        unique: true,
        default: () => `BK${Date.now()}${Math.random().toString(36).substr(2, 4).toUpperCase()}`
    },
    
    // Parties involved
    userId: { type: String, required: true, ref: 'User' },
    serviceProviderId: { type: String, required: true, ref: 'ServiceProvider' },
    
    // Service Details
    serviceType: { type: String, required: true },
    category: { 
        type: String, 
        required: true,
        enum: [
            'plumber', 'electrician', 'cleaner', 'carpenter', 
            'painter', 'mechanic', 'gardener', 'appliance-repair',
            'pest-control', 'ac-repair', 'home-security', 'other'
        ]
    },
    description: { type: String, required: true },
    
    // Scheduling
    scheduledDate: { type: Date, required: true },
    scheduledTime: { type: String, required: true }, // "14:30"
    duration: { type: Number, required: true }, // minutes
    endTime: { type: String }, // calculated or actual
    
    // Location
    serviceLocation: {
        address: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        pincode: { type: String, required: true },
        coordinates: {
            type: { type: String, enum: ['Point'], default: 'Point' },
            coordinates: { type: [Number] } // [longitude, latitude]
        },
        landmark: { type: String },
        contactPerson: { type: String },
        contactPhone: { type: String }
    },
    
    // Pricing & Payment
    pricing: {
        serviceCharge: { type: Number, required: true },
        platformFee: { type: Number, required: true },
        taxes: { type: Number, default: 0 },
        discount: { type: Number, default: 0 },
        totalAmount: { type: Number, required: true },
        currency: { type: String, default: 'INR' }
    },
    
    payment: {
        method: { 
            type: String, 
            enum: ['wallet', 'razorpay', 'cod', 'partial'], 
            required: true 
        },
        status: { 
            type: String, 
            enum: ['pending', 'paid', 'failed', 'refunded', 'partial'], 
            default: 'pending' 
        },
        transactionId: { type: String },
        razorpayOrderId: { type: String },
        razorpayPaymentId: { type: String },
        walletAmount: { type: Number, default: 0 },
        gatewayAmount: { type: Number, default: 0 },
        codAmount: { type: Number, default: 0 },
        paidAt: { type: Date },
        refundAmount: { type: Number, default: 0 },
        refundedAt: { type: Date }
    },
    
    // Status Management
    status: {
        type: String,
        enum: [
            'pending',           // Waiting for provider acceptance
            'confirmed',         // Provider accepted
            'in-progress',       // Service started
            'completed',         // Service completed
            'cancelled',         // Cancelled by user/provider
            'no-show',          // Provider didn't show up
            'disputed'          // Under dispute
        ],
        default: 'pending'
    },
    
    // Timeline tracking
    timeline: [{
        status: { type: String },
        timestamp: { type: Date, default: Date.now },
        updatedBy: { type: String }, // userId
        notes: { type: String }
    }],
    
    // Cancellation
    cancellation: {
        cancelledBy: { type: String }, // userId
        cancelledAt: { type: Date },
        reason: { type: String },
        refundAmount: { type: Number },
        cancellationFee: { type: Number, default: 0 }
    },
    
    // Service completion
    completion: {
        completedAt: { type: Date },
        actualDuration: { type: Number }, // minutes
        workDescription: { type: String },
        beforePhotos: [{ type: String }],
        afterPhotos: [{ type: String }],
        materialsCost: { type: Number, default: 0 },
        additionalCharges: { type: Number, default: 0 }
    },
    
    // Reviews (will be populated from Review model)
    hasReview: { type: Boolean, default: false },
    
    // Special instructions
    specialInstructions: { type: String },
    emergencyService: { type: Boolean, default: false },
    
    // Metadata
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
}, { 
    minimize: false,
    timestamps: true 
});

// Indexes for performance
bookingSchema.index({ bookingId: 1 });
bookingSchema.index({ userId: 1 });
bookingSchema.index({ serviceProviderId: 1 });
bookingSchema.index({ status: 1 });
bookingSchema.index({ scheduledDate: 1 });
bookingSchema.index({ category: 1 });
bookingSchema.index({ "payment.status": 1 });
bookingSchema.index({ createdAt: -1 });
// Make geospatial index sparse to avoid indexing errors on docs without valid geo
bookingSchema.index({ "serviceLocation.coordinates": "2dsphere" }, { sparse: true });

// Update timeline when status changes
bookingSchema.pre('save', function(next) {
    this.updatedAt = new Date();
    
    // Add to timeline if status changed
    if (this.isModified('status')) {
        this.timeline.push({
            status: this.status,
            timestamp: new Date(),
            updatedBy: this.userId // This should be set by the API
        });
    }
    
    next();
});

const Booking = mongoose.models.Booking || mongoose.model('Booking', bookingSchema);

export default Booking;

