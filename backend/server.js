const express = require('express');
const cors = require('cors');
require('dotenv').config();
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const complaintRoutes = require('./routes/complainRoutes');
const sessionMiddleware = require("./middleware/sessionMiddleware");
const connectDB = require("./connection/db");
const app = express();
app.use(cors());
app.use(express.json());

connectDB();
  
app.use(express.json());
app.use(sessionMiddleware);

app.use('/api/auth', authRoutes);

app.use('/api/complaints', complaintRoutes);



app.get('/', (req, res) => res.send('Backend Running...'));



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
