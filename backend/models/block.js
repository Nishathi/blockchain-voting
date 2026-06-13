const mongoose = require('mongoose');

const blockSchema = new mongoose.Schema({
  index: {
    type: Number,
    required: true
  },
  timestamp: {
    type: String,
    required: true
  },
  voterId: {
    type: String,
    required: true
  },
  candidateId: {
    type: String,
    required: true
  },
  candidateName: {
    type: String,
    required: true
  },
  signature: {
    type: String,
    required: true
  },
  previousHash: {
    type: String,
    required: true
  },
  hash: {
    type: String,
    required: true
  },
  nonce: {
    type: Number,
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Block', blockSchema);
