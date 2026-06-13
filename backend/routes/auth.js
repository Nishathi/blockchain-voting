const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const Voter = require('../models/voter');

// Generate wallet keys
function generateWallet() {
  const privateKey = crypto.randomBytes(32).toString('hex');
  const publicKey = crypto.createHash('sha256')
    .update(privateKey)
    .digest('hex');
  return { publicKey, privateKey };
}

// Register voter
router.post('/register', async (req, res) => {
  try {
    const { voterId, name, email, password } = req.body;

    // Check existing
    const existing = await Voter.findOne({
      $or: [{ voterId }, { email }]
    });
    if (existing) {
      return res.status(400).json({ error: 'Voter already registered' });
    }

    // Generate wallet
    const { publicKey, privateKey } = generateWallet();

    // Create voter
    const voter = new Voter({
      voterId,
      name,
      email,
      password,
      publicKey,
      privateKey
    });

    await voter.save();

    res.status(201).json({
      message: 'Voter registered successfully',
      voter: {
        voterId: voter.voterId,
        name: voter.name,
        publicKey: voter.publicKey,
        privateKey: voter.privateKey
      }
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Login voter
router.post('/login', async (req, res) => {
  try {
    const { voterId, password } = req.body;

    const voter = await Voter.findOne({ voterId });
    if (!voter) {
      return res.status(404).json({ error: 'Voter not found' });
    }

    const isMatch = await voter.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: voter._id, voterId: voter.voterId },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      voter: {
        voterId: voter.voterId,
        name: voter.name,
        hasVoted: voter.hasVoted,
        publicKey: voter.publicKey
      }
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
