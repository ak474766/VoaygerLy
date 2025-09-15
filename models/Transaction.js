import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
    transactionId: { 
        type: String, 
        required: true, 
        unique: true,
        default: () => `TXN${Date.now()}${Math.random().toString(36).substr(2, 6).toUpperCase()}`
    },
    
    // Transaction parties
    userId: { type: String, required: true, ref: 'User' },
    serviceProviderId: { type: String, ref: 'ServiceProvider' },
    bookingId: { type: String, ref: 'Booking' },
    
    // Transaction details
    type: {
        type: String,
        required: true,
        enum: [
            'wallet_topup',      // User adds money to wallet
            'wallet_debit',      // Money deducted from wallet
            'payment',           // Service payment
            'refund',            // Refund to user
            'payout',            // Payment to service provider
            'platform_fee',      // Platform commission
            'cancellation_fee',  // Cancellation charges
            'bonus',             // Promotional credits
            'penalty'            // Penalty charges
        ]
    },
    
    amount: { type: Number, required: true },
    currency: { type: String, default: 'INR' },
    
    // Payment method details
    paymentMethod: {
        type: { 
            type: String, 
            enum: ['wallet', 'razorpay', 'cod', 'bank_transfer', 'upi'], 
            required: true 
        },
        details: {
            // For Razorpay
            razorpayOrderId: { type: String },
            razorpayPaymentId: { type: String },
            razorpaySignature: { type: String },
            
            // For UPI
            upiId: { type: String },
            
            // For bank transfer
            bankAccount: { type: String },
            ifscCode: { type: String },
            
            // For COD
            collectedBy: { type: String }, // service provider ID
            collectedAt: { type: Date }
        }
    },
    
    // Transaction status
    status: {
        type: String,
        enum: ['pending', 'processing', 'completed', 'failed', 'cancelled', 'refunded'],
        default: 'pending'
    },
    
    // Wallet balance tracking
    walletBalance: {
        before: { type: Number },
        after: { type: Number }
    },
    
    // Fee breakdown
    fees: {
        platformFee: { type: Number, default: 0 },
        paymentGatewayFee: { type: Number, default: 0 },
        taxes: { type: Number, default: 0 }
    },
    
    // Reference and description
    description: { type: String, required: true },
    reference: { type: String }, // External reference (gateway transaction ID)
    
    // Failure details
    failure: {
        code: { type: String },
        reason: { type: String },
        description: { type: String }
    },
    
    // Refund details
    refund: {
        refundId: { type: String },
        refundAmount: { type: Number },
        refundedAt: { type: Date },
        refundReason: { type: String }
    },
    
    // Metadata
    metadata: {
        ipAddress: { type: String },
        userAgent: { type: String },
        source: { type: String, enum: ['web', 'mobile', 'admin'], default: 'web' }
    },
    
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
}, { 
    minimize: false,
    timestamps: true 
});

// Indexes for performance
transactionSchema.index({ transactionId: 1 });
transactionSchema.index({ userId: 1 });
transactionSchema.index({ serviceProviderId: 1 });
transactionSchema.index({ bookingId: 1 });
transactionSchema.index({ type: 1 });
transactionSchema.index({ status: 1 });
transactionSchema.index({ createdAt: -1 });
transactionSchema.index({ "paymentMethod.type": 1 });

// Update the updatedAt field before saving
transactionSchema.pre('save', function(next) {
    this.updatedAt = new Date();
    next();
});

const Transaction = mongoose.models.Transaction || mongoose.model('Transaction', transactionSchema);

export default Transaction;
