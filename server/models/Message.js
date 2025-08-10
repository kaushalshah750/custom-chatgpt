const mongoose = require('mongoose');
const MessageSchema = new mongoose.Schema({
  chatId: { type: mongoose.Schema.Types.ObjectId, ref: 'Chat', required: true },
  role: { type: String, enum: ['user', 'assistant', 'system'], required: true },
  content: { type: String, required: true },
  tokenUsage: { type: Number, default: 0 },
  timestamp: { type: Date, default: Date.now },
});
module.exports = mongoose.model('Message', MessageSchema);