exports.checkUserSession = (req, res) => {
  if (req.session && req.session.user) {
    return res.status(200).json({ message: "User logged in", user: req.session.user });
  } else {
    return res.status(401).json({ message: "User not logged in" });
  }
};
