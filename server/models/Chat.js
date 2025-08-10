const mongoose = require('mongoose');
const ChatSchema = new mongoose.Schema({
  title: { type: String, default: 'New Chat' },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  folderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Folder', default: null },
  createdAt: { type: Date, default: Date.now },
  model: { type: String, default: 'gpt-3.5-turbo' },
  systemPrompt: { type: String, default: 'You are a helpful assistant.' },
  temperature: { type: Number, default: 0.7 },
});
module.exports = mongoose.model('Chat', ChatSchema);