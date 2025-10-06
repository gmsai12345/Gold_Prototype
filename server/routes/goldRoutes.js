const express = require('express');
const Gold = require('../models/goldModel.js');

const router = express.Router();

// Get gold inventory for a user
router.get('/:userId', async (req, res) => {
  try {
    const gold = await Gold.findByUserId(req.params.userId);
    res.status(200).json(gold);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add gold inventory for a user
router.post('/', async (req, res) => {
  try {
    const id = await Gold.create(req.body);
    res.status(201).json({ id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// ...existing code...