const express = require('express');
const User = require('../models/userModel.js');

const router = express.Router();

// Get all users (admin only)
router.get('/', async (req, res) => {
  try {
    const users = await User.getAll();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  // ...existing code...
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create user
router.post('/', async (req, res) => {
  try {
    const id = await User.create(req.body);
    res.status(201).json({ id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update user status
router.put('/:id/status', async (req, res) => {
  try {
    await User.updateStatus(req.params.id, req.body.status);
    res.status(200).json({ message: 'Status updated' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
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