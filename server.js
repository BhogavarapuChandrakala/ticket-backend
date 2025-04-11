require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const seatRoutes = require('./routes/seats');
const authRoutes = require('./routes/auth'); // ✅ Import auth routes

const app = express();

// Middleware
app.use(cors("*"));
app.use(bodyParser.json());

// Routes
app.use('/api/seats', seatRoutes);
app.use('/api/auth', authRoutes); // ✅ Add this line

// Server
const JWT_SECRET = process.env.JWT_SECRET;
const PORT = process.env.PORT || 5000;
console.log("JWT_SECRET:", JWT_SECRET); 
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
