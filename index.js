require("dotenv").config();

const express = require("express");
const { connectDB, pool } = require("./database");
const categoryRoute = require("./routes/categoryRoutes");
const unitRoute = require("./routes/unitRoutes");
const adminRoutes = require("./routes/adminRoutes");
const productRoutes = require("./routes/productRoutes");
const batchRoutes = require("./routes/batchRoutes");

const auth = require("./middleware/authMiddleware");

const app = express();

const PORT = process.env.PORT || 3000; // or process.env.PORT

// Middleware
app.use(express.json());

// Example route
app.get("/", (req, res) => {
  res.send("POS API is running...");
});

// Start server after DB connection
(async () => {
  await connectDB();

  const { loginAdmin } = require("./controllers/adminController");
  app.post("/api/admin/login", loginAdmin); // Only this is public

  // Middleware to protect all other routes
  app.use(auth.verifyToken);

  // Use category routes
  app.use("/api/categories", categoryRoute);
  app.use("/api/units/", unitRoute);
  app.use("/api/admin/", adminRoutes);
  app.use("/api/products/", productRoutes);
  app.use("/api/batch/", batchRoutes);

  app.listen(PORT, () => {
    console.log(`🚀 Server started at http://localhost:${PORT}`);
  });
})();
