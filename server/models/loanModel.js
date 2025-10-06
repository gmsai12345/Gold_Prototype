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
const db = require('./db');

const Loan = {
  async create({ userId, goldAmount, loanAmount, interestRate = 11.0, tenure, purpose }) {
    const [result] = await db.query(
      'INSERT INTO loans (userId, goldAmount, loanAmount, interestRate, tenure, purpose) VALUES (?, ?, ?, ?, ?, ?)',
      [userId, goldAmount, loanAmount, interestRate, tenure, purpose]
    );
    return result.insertId;
  },

  async findByUserId(userId) {
    const [rows] = await db.query('SELECT * FROM loans WHERE userId = ?', [userId]);
    return rows;
  },

  async updateStatus(id, status) {
    await db.query('UPDATE loans SET status = ? WHERE id = ?', [status, id]);
  },

  async getAll() {
    const [rows] = await db.query('SELECT * FROM loans');
    return rows;
  }
};

module.exports = Loan;

export default Loan;