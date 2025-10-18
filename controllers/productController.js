const { pool } = require("../database");

// Create Product
exports.createProduct = async (req, res) => {
  try {
    const {
      product_code,
      product_name,
      category_id,
      brand,
      description,
      unit_symbol,
    } = req.body;

    if (!product_code || !product_name || !unit_symbol) {
      return res
        .status(400)
        .json({ error: "Product code, name, and unit_symbol are required." });
    }

    const [result] = await pool.query(
      `INSERT INTO product (product_code, product_name, category_id, brand, description, unit_symbol)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        product_code,
        product_name,
        category_id || null,
        brand || null,
        description || null,
        unit_symbol,
      ]
    );

    res
      .status(201)
      .json({ message: "Product created successfully", id: result.insertId });
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      res.status(400).json({ error: "Product code already exists." });
    } else {
      res.status(500).json({ error: err.message });
    }
  }
};

// Get All Products
exports.getProducts = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT p.*, c.category_name, u.unit_symbol
       FROM product p
       LEFT JOIN product_category c ON p.category_id = c.category_id
       LEFT JOIN unit_type u ON p.unit_symbol = u.unit_symbol
       ORDER BY p.product_id DESC`
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get Product by ID
exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query(
      `SELECT p.*, c.category_name, u.description AS unit_description
       FROM product p
       LEFT JOIN product_category c ON p.category_id = c.category_id
       LEFT JOIN unit_type u ON p.unit_symbol = u.unit_symbol
       WHERE p.product_id = ?`,
      [id]
    );

    if (rows.length === 0)
      return res.status(404).json({ message: "Product not found" });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update Product
exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      product_code,
      product_name,
      category_id,
      brand,
      description,
      unit_symbol,
      status,
    } = req.body;

    const [result] = await pool.query(
      `UPDATE product 
       SET product_code=?, product_name=?, category_id=?, brand=?, description=?, unit_symbol=?, status=? 
       WHERE product_id=?`,
      [
        product_code,
        product_name,
        category_id || null,
        brand || null,
        description || null,
        unit_symbol,
        status,
        id,
      ]
    );

    if (result.affectedRows === 0)
      return res.status(404).json({ message: "Product not found" });

    res.json({ message: "Product updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete Product
exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await pool.query(
      "DELETE FROM product WHERE product_id = ?",
      [id]
    );

    if (result.affectedRows === 0)
      return res.status(404).json({ message: "Product not found" });

    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Set Product Inactive / Active
exports.setProductStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // expect 'active' or 'inactive'

    if (!["active", "inactive"].includes(status)) {
      return res
        .status(400)
        .json({ error: "Status must be 'active' or 'inactive'." });
    }

    const [result] = await pool.query(
      "UPDATE product SET status = ? WHERE product_id = ?",
      [status, id]
    );

    if (result.affectedRows === 0)
      return res.status(404).json({ message: "Product not found" });

    res.json({ message: `Product status set to ${status}` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
