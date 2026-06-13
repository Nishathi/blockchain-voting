const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const Block = require('../models/block');
const Voter = require('../models/voter');
const authMiddleware = require('../middleware/auth');

const DIFFICULTY = 2;
const CANDIDATES = [
  { id: 'alice', name: 'Alice Chen' },
  { id: 'bob',   name: 'Bob Kumar' },
  { id: 'clara', name: 'Clara Osei' }
];

// SHA-256 hash
function sha256(data) {
  return crypto.createHash('sha256').update(data).digest('hex');
}

// Mine block (Proof of Work)
function mineBlock(blockData) {
  let nonce = 0;
  let hash = '';
  const prefix = '0'.repeat(DIFFICULTY);

  while (!hash.startsWith(prefix)) {
    nonce++;
    hash = sha256(JSON.stringify({ ...blockData, nonce }));
  }

  return { nonce, hash };
}

// Cast vote
router.post('/cast', authMiddleware, async (req, res) => {
  try {
    const { candidateId, signature } = req.body;
    const voterId = req.voter.voterId;

    // Check already voted
    const voter = await Voter.findOne({ voterId });
    if (voter.hasVoted) {
      return res.status(400).json({ error: 'Already voted' });
    }

    // Validate candidate
    const candidate = CANDIDATES.find(c => c.id === candidateId);
    if (!candidate) {
      return res.status(400).json({ error: 'Invalid candidate' });
    }

    // Get last block
    const lastBlock = await Block.findOne().sort({ index: -1 });
    const previousHash = lastBlock ? lastBlock.hash : '0'.repeat(64);
    const index = lastBlock ? lastBlock.index + 1 : 1;

    // Block data
    const timestamp = new Date().toISOString();
    const blockData = {
      index,
      timestamp,
      voterId,
      candidateId,
      candidateName: candidate.name,
      signature,
      previousHash
    };

    // Mine block
    const { nonce, hash } = mineBlock(blockData);

    // Save block
    const block = new Block({ ...blockData, nonce, hash });
    await block.save();

    // Mark voter as voted
    voter.hasVoted = true;
    voter.voteTimestamp = new Date();
    await voter.save();

    res.json({
      message: 'Vote cast successfully',
      block: {
        index: block.index,
        hash: block.hash,
        nonce: block.nonce,
        timestamp: block.timestamp
      }
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get results
router.get('/results', async (req, res) => {
  try {
    const blocks = await Block.find().sort({ index: 1 });

    const results = CANDIDATES.map(c => ({
      id: c.id,
      name: c.name,
      votes: blocks.filter(b => b.candidateId === c.id).length
    }));

    const totalVotes = blocks.length;

    res.json({ results, totalVotes, blocks });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get blockchain
router.get('/chain', async (req, res) => {
  try {
    const blocks = await Block.find().sort({ index: 1 });
    res.json({ chain: blocks, length: blocks.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Validate chain integrity
router.get('/validate', async (req, res) => {
  try {
    const blocks = await Block.find().sort({ index: 1 });
    let valid = true;
    let invalidBlock = null;

    for (let i = 1; i < blocks.length; i++) {
      const block = blocks[i];
      const recalculated = crypto.createHash('sha256')
        .update(JSON.stringify({
          index: block.index,
          timestamp: block.timestamp,
          voterId: block.voterId,
          candidateId: block.candidateId,
          candidateName: block.candidateName,
          signature: block.signature,
          previousHash: block.previousHash,
          nonce: block.nonce
        }))
        .digest('hex');

      if (recalculated !== block.hash) {
        valid = false;
        invalidBlock = block.index;
        break;
      }
    }

    res.json({ valid, invalidBlock });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
