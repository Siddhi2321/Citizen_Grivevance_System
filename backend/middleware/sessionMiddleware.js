const session = require("express-session");
const MongoStore = require("connect-mongo");
require('dotenv').config();

const sessionMiddleware = session({
  secret: process.env.SESSION_SECRET || "officerSecret123",
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI,
    collectionName: 'sessions'
  }),
  cookie: {
    maxAge: 2* 60 * 1000,
    httpOnly: true,
    sameSite: "lax",
    secure: false
  }
});

module.exports = sessionMiddleware;
