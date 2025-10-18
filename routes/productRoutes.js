const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");

router.post("/", productController.createProduct); // Create product
router.get("/", productController.getProducts); // Get all products
router.get("/:id", productController.getProductById); // Get single product
router.put("/:id", productController.updateProduct); // Update product
router.delete("/:id", productController.deleteProduct); // Delete product
router.put("/:id/status", productController.setProductStatus); // Activate / Deactivate product

module.exports = router;
