// server/server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const chatRoutes = require('./routes/chatRoutes');
const adminRoutes = require('./routes/adminRoutes'); // Assuming you'll protect this later
const folderRoutes = require('./routes/folderRoutes');
const userRoutes = require('./routes/userRoutes'); // <-- IMPORT

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors({ origin: 'http://localhost:5173' })); // Allow frontend to connect
app.use(express.json());

// Database Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected successfully.'))
  .catch(err => console.error('MongoDB connection error:', err));

// API Routes
app.get('/', (req, res) => res.send('API is running...')); // Health check
app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/folders', folderRoutes);
app.use('/api/users', userRoutes); // <-- USE THE NEW ROUTE

// Global Error Handler (simple version)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));