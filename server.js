/**
 * SERVER ENTRY POINT
 * Initializes Express, connects to MongoDB Atlas cluster, and starts the API.
 */
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

app.use(cors());
app.use(express.json());

// Mount API Routes under /api/users
app.use('/api/users', userRoutes);

app.get('/', (req, res) => {
  res.status(200).json({ status: 'Order Book API is running live and secure on MongoDB Atlas.' });
});

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB Atlas successfully!');
    app.listen(PORT, () => {
      console.log(`Server is running live on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Database connection error:', err);
  });