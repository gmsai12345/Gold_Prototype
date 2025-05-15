import mongoose from 'mongoose';

const loanSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  goldAmount: {
    type: Number,
    required: true,
    min: 0
  },
  loanAmount: {
    type: Number,
    required: true,
    min: 0
  },
  interestRate: {
    type: Number,
    default: 11.0,
    required: true
  },
  tenure: {
    type: Number,
    required: true,
    min: 1
  }, // in months
  purpose: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'closed'],
    default: 'pending'
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  approvedAt: Date,
  rejectionReason: String,
  startDate: Date,
  endDate: Date,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the timestamp before saving
loanSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Loan = mongoose.model('Loan', loanSchema);

export default Loan;