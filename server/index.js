dotenv.config();
const express = require('express');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes.js');
const goldRoutes = require('./routes/goldRoutes.js');
const loanRoutes = require('./routes/loanRoutes.js');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/gold', goldRoutes);
app.use('/api/loans', loanRoutes);

app.get('/', (req, res) => {
  res.send('Gold Storage & Loan Management API (MySQL) is running');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});