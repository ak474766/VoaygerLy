import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    // Conversation parties
    senderId: { type: String, required: true, ref: 'User' },
    receiverId: { type: String, required: true, ref: 'User' },
    bookingId: { type: String, required: true, ref: 'Booking' },
    
    // Message content
    messageType: {
        type: String,
        enum: ['text', 'image', 'document', 'location', 'system'],
        default: 'text'
    },
    
    content: {
        text: { type: String },
        mediaUrl: { type: String },
        fileName: { type: String },
        fileSize: { type: Number },
        mimeType: { type: String },
        location: {
            latitude: { type: Number },
            longitude: { type: Number },
            address: { type: String }
        }
    },
    
    // Message status
    status: {
        type: String,
        enum: ['sent', 'delivered', 'read'],
        default: 'sent'
    },
    
    // Read receipt
    readAt: { type: Date },
    deliveredAt: { type: Date },
    
    // System message details (for booking updates)
    systemMessage: {
        type: { 
            type: String,
            enum: ['booking_confirmed', 'booking_cancelled', 'payment_received', 'service_completed', 'other']
        },
        data: { type: mongoose.Schema.Types.Mixed }
    },
    
    // Reply to message
    replyTo: { type: mongoose.Schema.Types.ObjectId, ref: 'Message' },
    
    // Message encryption (optional)
    isEncrypted: { type: Boolean, default: false },
    
    // Metadata
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
}, { 
    minimize: false,
    timestamps: true 
});

// Indexes for performance
messageSchema.index({ senderId: 1, receiverId: 1 });
messageSchema.index({ bookingId: 1 });
messageSchema.index({ createdAt: -1 });
messageSchema.index({ status: 1 });

// Update the updatedAt field before saving
messageSchema.pre('save', function(next) {
    this.updatedAt = new Date();
    next();
});

const Message = mongoose.models.Message || mongoose.model('Message', messageSchema);

export default Message;
