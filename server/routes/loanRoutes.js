import express from 'express';
import Loan from '../models/loanModel.js';
import User from '../models/userModel.js';

const router = express.Router();

// Get all loans (admin only)
router.get('/', async (req, res) => {
  try {
    const loans = await Loan.find().populate('userId', 'email formData.fullName');
    res.status(200).json(loans);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get loans for a specific user
router.get('/user/:userId', async (req, res) => {
  try {
    const loans = await Loan.find({ userId: req.params.userId });
    res.status(200).json(loans);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get pending loan applications (admin only)
router.get('/pending', async (req, res) => {
  try {
    const pendingLoans = await Loan.find({ status: 'pending' }).populate('userId', 'email formData.fullName');
    res.status(200).json(pendingLoans);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new loan application
router.post('/', async (req, res) => {
  const { userId, goldAmount, loanAmount, tenure, purpose } = req.body;
  
  try {
    // Validate user exists and has enough gold in safe
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    if (user.goldHoldings.goldInSafe < goldAmount) {
      return res.status(400).json({ 
        message: 'Insufficient gold in safe',
        available: user.goldHoldings.goldInSafe,
        requested: goldAmount
      });
    }
    
    // Create new loan application
    const newLoan = new Loan({
      userId,
      goldAmount,
      loanAmount,
      tenure,
      purpose,
      interestRate: 11.0 // Fixed as per requirements
    });
    
    await newLoan.save();
    res.status(201).json(newLoan);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Process loan application (admin only)
router.put('/:loanId/process', async (req, res) => {
  const { status, approvedBy, rejectionReason } = req.body;
  
  try {
    const loan = await Loan.findById(req.params.loanId);
    if (!loan) {
      return res.status(404).json({ message: 'Loan application not found' });
    }
    
    // Update loan status
    loan.status = status;
    
    if (status === 'approved') {
      // Update loan details
      loan.approvedBy = approvedBy;
      loan.approvedAt = new Date();
      loan.startDate = new Date();
      
      // Calculate end date based on tenure
      const endDate = new Date();
      endDate.setMonth(endDate.getMonth() + loan.tenure);
      loan.endDate = endDate;
      
      // Update user's gold holdings
      const user = await User.findById(loan.userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      // Ensure user has enough gold in safe
      if (user.goldHoldings.goldInSafe < loan.goldAmount) {
        return res.status(400).json({ 
          message: 'Insufficient gold in safe',
          available: user.goldHoldings.goldInSafe,
          requested: loan.goldAmount
        });
      }
      
      // Move gold from safe to mortgaged
      user.goldHoldings.goldInSafe -= loan.goldAmount;
      user.goldHoldings.goldMortgaged += loan.goldAmount;
      
      await user.save();
    } else if (status === 'rejected') {
      loan.rejectionReason = rejectionReason;
    }
    
    await loan.save();
    res.status(200).json({ message: `Loan ${status}`, loan });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;