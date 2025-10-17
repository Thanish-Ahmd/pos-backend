// routes/categoryRoutes.js
const express = require("express");
const router = express.Router();

// Import controller functions
const categoryController = require("../controllers/categoryController");

// Category Routes
router.post("/", categoryController.createCategory);
router.get("/", categoryController.getCategories);
router.put("/:id", categoryController.updateCategory);
router.delete("/:id", categoryController.deleteCategory);
router.get("/:id", categoryController.getCategoryById);

module.exports = router;
