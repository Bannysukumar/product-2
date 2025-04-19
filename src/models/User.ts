import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    unique: true,
    sparse: true,
  },
  password: {
    type: String,
    required: true,
  },
  membershipStatus: {
    type: String,
    enum: ['free', 'paid'],
    default: 'free',
  },
  memberId: {
    type: String,
    unique: true,
    sparse: true,
  },
  referralId: {
    type: String,
    unique: true,
    sparse: true,
  },
  referredBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
  directReferrals: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  earnings: {
    type: Number,
    default: 0,
  },
  withdrawals: [{
    amount: Number,
    status: {
      type: String,
      enum: ['pending', 'processed', 'rejected'],
    },
    paymentMethod: {
      type: String,
      enum: ['bank_transfer', 'phonepe', 'google_pay', 'cash'],
    },
    processedAt: Date,
    createdAt: {
      type: Date,
      default: Date.now,
    },
  }],
  emailVerified: {
    type: Boolean,
    default: false,
  },
  phoneVerified: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Create indexes
userSchema.index({ phone: 1 });
userSchema.index({ email: 1 });
userSchema.index({ memberId: 1 });
userSchema.index({ referralId: 1 });

const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User; 