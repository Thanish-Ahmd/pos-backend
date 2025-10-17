require("dotenv").config();
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET; // In production use process.env.JWT_SECRET
const tokenBlacklist = new Set(); // same as before (for logout invalidation)

exports.verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader)
    return res.status(401).json({ error: "Access denied. No token provided." });

  const token = authHeader.trim(); // direct token, no Bearer
  if (tokenBlacklist.has(token))
    return res.status(401).json({ error: "Token invalidated (logged out)." });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.admin = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};

exports.tokenBlacklist = tokenBlacklist;
exports.JWT_SECRET = JWT_SECRET;
