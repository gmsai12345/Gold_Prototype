import express from 'express';
import User from '../models/userModel.js';

const router = express.Router();

// Get gold holdings for a user
router.get('/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.status(200).json(user.goldHoldings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update gold holdings (admin only)
router.put('/:userId', async (req, res) => {
  const { totalGold, goldInSafe, goldMortgaged } = req.body;
  
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Validate values
    if (totalGold !== undefined && totalGold < 0) {
      return res.status(400).json({ message: 'Total gold cannot be negative' });
    }
    
    if (goldInSafe !== undefined && goldInSafe < 0) {
      return res.status(400).json({ message: 'Gold in safe cannot be negative' });
    }
    
    if (goldMortgaged !== undefined && goldMortgaged < 0) {
      return res.status(400).json({ message: 'Mortgaged gold cannot be negative' });
    }
    
    // Check that sum of goldInSafe and goldMortgaged equals totalGold
    const newGoldInSafe = goldInSafe !== undefined ? goldInSafe : user.goldHoldings.goldInSafe;
    const newGoldMortgaged = goldMortgaged !== undefined ? goldMortgaged : user.goldHoldings.goldMortgaged;
    const newTotalGold = totalGold !== undefined ? totalGold : user.goldHoldings.totalGold;
    
    if (Math.abs((newGoldInSafe + newGoldMortgaged) - newTotalGold) > 0.001) {
      return res.status(400).json({ 
        message: 'Sum of gold in safe and mortgaged gold must equal total gold',
        goldInSafe: newGoldInSafe,
        goldMortgaged: newGoldMortgaged,
        totalGold: newTotalGold
      });
    }
    
    // Update gold holdings
    user.goldHoldings = {
      totalGold: newTotalGold,
      goldInSafe: newGoldInSafe,
      goldMortgaged: newGoldMortgaged
    };
    
    await user.save();
    res.status(200).json({ message: 'Gold holdings updated successfully', goldHoldings: user.goldHoldings });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;