import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  firebaseUid: {
    type: String,
    required: true,
    unique: true
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
  form: {
    type: Number,
    default: 0, // 0: not filled, 1: filled, -1: rejected
    enum: [-1, 0, 1]
  },
  formData: {
    fullName: String,
    dateOfBirth: Date,
    gender: {
      type: String,
      enum: ['Male', 'Female', 'Other']
    },
    fatherSpouseName: String,
    maritalStatus: {
      type: String,
      enum: ['Single', 'Married', 'Divorced', 'Widowed']
    },
    nationality: String,
    currentAddress: {
      street: String,
      city: String,
      state: String,
      pincode: String,
      country: String
    },
    permanentAddress: {
      sameAsCurrent: {
        type: Boolean,
        default: false
      },
      street: String,
      city: String,
      state: String,
      pincode: String,
      country: String
    },
    mobileNumber: String,
    alternateMobileNumber: String,
    preferredCommunication: {
      type: String,
      enum: ['SMS', 'Email', 'Both']
    },
    panCardNumber: String,
    aadhaarNumber: String,
    additionalIdType: {
      type: String,
      enum: ['Voter ID', 'Driving License', 'Passport']
    },
    additionalIdNumber: String,
    employmentType: {
      type: String,
      enum: ['Salaried', 'Self-employed', 'Business', 'Professional', 'Retired', 'Homemaker']
    },
    organizationName: String,
    designation: String,
    workAddress: String,
    workContactNumber: String,
    monthlyIncomeRange: String,
    annualIncome: Number,
    sector: String,
    nominee: {
      name: String,
      relationship: String,
      dateOfBirth: Date,
      address: String,
      contactNumber: String
    }
  },
  rejectionReason: String,
  goldHoldings: {
    totalGold: {
      type: Number,
      default: 0
    },
    goldInSafe: {
      type: Number,
      default: 0
    },
    goldMortgaged: {
      type: Number,
      default: 0
    }
  },
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
userSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const User = mongoose.model('User', userSchema);

export default User;