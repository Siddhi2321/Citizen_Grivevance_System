const express = require('express');
const cors = require('cors');
require('dotenv').config();
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const complaintRoutes = require('./routes/complainRoutes');
const sessionMiddleware = require("./middleware/sessionMiddleware");
const connectDB = require("./connection/db");
const officerRoutes = require('./routes/officerRoutes');
const admin = require('./models/admin');
const adminRoutes = require('./routes/adminRoutes');
const app = express();
app.use(express.json());

connectDB();
  
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

app.use(sessionMiddleware);


//user
app.use('/api/auth', authRoutes);

//complaints
app.use('/api/complaints', complaintRoutes);


//officer
app.use('/api/officer', officerRoutes);


//admin
app.use('/api/admin', adminRoutes);

app.get('/', (req, res) => res.send('Backend Running...'));



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
