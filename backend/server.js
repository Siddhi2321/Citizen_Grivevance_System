const express = require('express');
const cors = require('cors');
require('dotenv').config();
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const complaintRoutes = require('./routes/complainRoutes');
const sessionMiddleware = require("./middleware/sessionMiddleware");

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB error", err));

  
app.use(express.json());
app.use(sessionMiddleware);

app.use('/api/auth', authRoutes);

app.use('/api/complaints', complaintRoutes);



app.get('/', (req, res) => res.send('Backend Running...'));



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
