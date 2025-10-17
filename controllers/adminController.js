const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { pool } = require("../database");

// const JWT_SECRET = "pos"; // replace with process.env.JWT_SECRET in production
const TOKEN_EXPIRY = "24h";

const { tokenBlacklist, JWT_SECRET } = require("../middleware/authMiddleware");

// Register new admin (hash password)
exports.registerAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Check if admin already exists
    const [existing] = await pool.query(
      "SELECT * FROM admin_user WHERE email = ?",
      [email]
    );
    if (existing.length > 0) {
      return res.status(400).json({ error: "Email already registered" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save admin
    await pool.query(
      "INSERT INTO admin_user (name, email, password) VALUES (?, ?, ?)",
      [name, email, hashedPassword]
    );

    res.status(201).json({ message: "Admin registered successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Admin login
exports.loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    // Check if admin exists
    const [rows] = await pool.query(
      "SELECT * FROM admin_user WHERE email = ?",
      [email]
    );
    if (rows.length === 0) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const admin = rows[0];

    // Compare password
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Generate token (24 hours)
    const token = jwt.sign(
      { email: admin.email, name: admin.name },
      JWT_SECRET,
      {
        expiresIn: TOKEN_EXPIRY,
      }
    );

    res.json({
      message: "Login successful",
      token,
      admin: { name: admin.name, email: admin.email },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all admins
exports.getAllAdmins = async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT name, email, created_at FROM admin_user"
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get admin by email
exports.getAdminByEmail = async (req, res) => {
  try {
    const { email } = req.params;
    const [rows] = await pool.query(
      "SELECT name, email, created_at FROM admin_user WHERE email=?",
      [email]
    );
    if (rows.length === 0)
      return res.status(404).json({ message: "Admin not found" });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update password -  old password check
exports.updatePassword = async (req, res) => {
  try {
    const { email, oldPassword, newPassword } = req.body;

    if (!email || !oldPassword || !newPassword) {
      return res
        .status(400)
        .json({ error: "Email, old password, and new password are required" });
    }

    const [rows] = await pool.query("SELECT * FROM admin_user WHERE email=?", [
      email,
    ]);
    if (rows.length === 0)
      return res.status(404).json({ message: "Admin not found" });

    const admin = rows[0];
    const isMatch = await bcrypt.compare(oldPassword, admin.password);
    if (!isMatch)
      return res.status(401).json({ error: "Old password is incorrect" });

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    await pool.query("UPDATE admin_user SET password=? WHERE email=?", [
      hashedNewPassword,
      email,
    ]);

    res.json({ message: "Password updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete admin
exports.deleteAdmin = async (req, res) => {
  try {
    const { email } = req.params;
    const [result] = await pool.query("DELETE FROM admin_user WHERE email=?", [
      email,
    ]);

    if (result.affectedRows === 0)
      return res.status(404).json({ message: "Admin not found" });
    res.json({ message: "Admin deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Logout admin (invalidate token)
exports.logoutAdmin = async (req, res) => {
  try {
    const token = req.headers.authorization;
    if (!token) return res.status(400).json({ error: "No token provided" });

    tokenBlacklist.add(token);
    res.json({ message: "Logged out successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
