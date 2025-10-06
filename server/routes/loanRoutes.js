const express = require('express');
const Loan = require('../models/loanModel.js');

const router = express.Router();

// Get all loans
router.get('/', async (req, res) => {
  try {
    const loans = await Loan.getAll();
    res.status(200).json(loans);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get loans for a specific user
router.get('/user/:userId', async (req, res) => {
  try {
    const loans = await Loan.findByUserId(req.params.userId);
    res.status(200).json(loans);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new loan application
router.post('/', async (req, res) => {
  try {
    const id = await Loan.create(req.body);
    res.status(201).json({ id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update loan status
router.put('/:id/status', async (req, res) => {
  try {
    await Loan.updateStatus(req.params.id, req.body.status);
    res.status(200).json({ message: 'Status updated' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// ...existing code...