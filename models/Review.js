import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
    // Parties involved
    userId: { type: String, required: true, ref: 'User' },
    serviceProviderId: { type: String, required: true, ref: 'ServiceProvider' },
    bookingId: { type: String, required: true, ref: 'Booking', unique: true },
    
    // Rating (1-5 stars)
    rating: { 
        type: Number, 
        required: true, 
        min: 1, 
        max: 5 
    },
    
    // Review content
    title: { type: String, maxlength: 100 },
    comment: { type: String, maxlength: 1000 },
    
    // Detailed ratings
    detailedRating: {
        punctuality: { type: Number, min: 1, max: 5 },
        quality: { type: Number, min: 1, max: 5 },
        professionalism: { type: Number, min: 1, max: 5 },
        communication: { type: Number, min: 1, max: 5 },
        valueForMoney: { type: Number, min: 1, max: 5 }
    },
    
    // Media attachments
    photos: [{ type: String }], // URLs of photos
    
    // Service provider response
    response: {
        comment: { type: String, maxlength: 500 },
        respondedAt: { type: Date },
        respondedBy: { type: String } // serviceProviderId
    },
    
    // Moderation
    moderation: {
        status: {
            type: String,
            enum: ['pending', 'approved', 'rejected', 'flagged'],
            default: 'approved'
        },
        moderatedBy: { type: String }, // admin userId
        moderatedAt: { type: Date },
        moderationNotes: { type: String },
        flaggedReasons: [{ 
            type: String,
            enum: ['inappropriate', 'spam', 'fake', 'offensive', 'other']
        }]
    },
    
    // Helpfulness tracking
    helpfulness: {
        helpful: { type: Number, default: 0 },
        notHelpful: { type: Number, default: 0 },
        votedBy: [{ type: String }] // userIds who voted
    },
    
    // Verification
    isVerified: { type: Boolean, default: true }, // Verified booking = verified review
    
    // Metadata
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
}, { 
    minimize: false,
    timestamps: true 
});

// Indexes for performance
reviewSchema.index({ userId: 1 });
reviewSchema.index({ serviceProviderId: 1 });
reviewSchema.index({ bookingId: 1 });
reviewSchema.index({ rating: -1 });
reviewSchema.index({ "moderation.status": 1 });
reviewSchema.index({ createdAt: -1 });
reviewSchema.index({ isVerified: 1 });

// Update the updatedAt field before saving
reviewSchema.pre('save', function(next) {
    this.updatedAt = new Date();
    next();
});

const Review = mongoose.models.Review || mongoose.model('Review', reviewSchema);

export default Review;
