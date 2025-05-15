import express from 'express';
import User from '../models/userModel.js';

const router = express.Router();

// Get all users (admin only)
router.get('/', async (req, res) => {
  try {
    const users = await User.find().select('-__v');
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get pending form applications (admin only)
router.get('/pending-forms', async (req, res) => {
  try {
    const pendingForms = await User.find({ form: 1 }).select('-__v');
    res.status(200).json(pendingForms);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get user by Firebase UID
router.get('/firebase/:firebaseUid', async (req, res) => {
  try {
    const user = await User.findOne({ firebaseUid: req.params.firebaseUid }).select('-__v');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get user by email
router.get('/email/:email', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email }).select('-__v');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new user
router.post('/', async (req, res) => {
  const { email, firebaseUid, isAdmin } = req.body;
  
  try {
    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { firebaseUid }] });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
    
    // Create new user
    const newUser = new User({
      email,
      firebaseUid,
      isAdmin: isAdmin || email === process.env.ADMIN_EMAIL
    });
    
    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Submit user registration form
router.post('/submit-form/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Update form data
    user.formData = req.body;
    user.form = 1; // Set form as filled and pending approval
    
    await user.save();
    res.status(200).json({ message: 'Form submitted successfully', user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Approve or reject user form (admin only)
router.put('/review-form/:id', async (req, res) => {
  const { status, rejectionReason } = req.body;
  
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    if (status === 'approved') {
      user.form = 1; // Approved
    } else if (status === 'rejected') {
      user.form = -1; // Rejected
      user.rejectionReason = rejectionReason;
    }
    
    await user.save();
    res.status(200).json({ message: `Form ${status}`, user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update gold holdings (admin only)
router.put('/update-gold/:id', async (req, res) => {
  const { totalGold, goldInSafe, goldMortgaged } = req.body;
  
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    user.goldHoldings = {
      totalGold: totalGold || user.goldHoldings.totalGold,
      goldInSafe: goldInSafe || user.goldHoldings.goldInSafe,
      goldMortgaged: goldMortgaged || user.goldHoldings.goldMortgaged
    };
    
    await user.save();
    res.status(200).json({ message: 'Gold holdings updated', user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;