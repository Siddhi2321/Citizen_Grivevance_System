const session = require("express-session");

const sessionMiddleware = session({
  secret: "officerSecret123",
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 20 * 60 * 1000,
    httpOnly: true,
    sameSite: "lax",
    secure: false, 
  }
});

module.exports = sessionMiddleware;
