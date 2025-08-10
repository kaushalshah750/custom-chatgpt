const mongoose = require('mongoose');
const LogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  chatId: { type: mongoose.Schema.Types.ObjectId, ref: 'Chat', required: true },
  model: { type: String, required: true },
  inputTokens: { type: Number, required: true },
  outputTokens: { type: Number, required: true },
  responseTime: { type: Number }, // in ms
  success: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});
module.exports = mongoose.model('Log', LogSchema);