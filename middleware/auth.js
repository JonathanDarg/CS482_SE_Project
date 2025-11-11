// middleware/auth.js
module.exports = {
  isAuthenticated(req, res, next) {
    if (!req.session.user) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    next();
  },

  isAdmin(req, res, next) {
    if (!req.session.user || req.session.user.role !== "admin") {
      return res.status(403).json({ message: "Admin only" });
    }
    next();
  }
};
