// routes/batchRoutes.js
const express = require("express");
const router = express.Router();
const batchController = require("../controllers/batchController");

// Batch Routes
router.post("/", batchController.createBatch); // Create new batch
router.get("/", batchController.getAllBatches); // Get all batches
router.get("/:id", batchController.getBatchById); // Get batch by batch_id
router.get("/product/:productId", batchController.getBatchesByProduct); // Get all batches of a product
router.put("/:id", batchController.updateBatch); // Update batch details
router.delete("/:id", batchController.deleteBatch); // Delete batch

module.exports = router;
