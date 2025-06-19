module.exports = (req, res, next) => {
  if (!req.session.admin) {
    return res.status(401).json({ message: "Unauthorized: Please login as admin" });
  }
  next();
};
