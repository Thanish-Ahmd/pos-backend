const { pool } = require("../database");

// Create new category
exports.createCategory = async (req, res) => {
  try {
    const { category_name, description } = req.body;

    if (!category_name) {
      return res.status(400).json({ error: "Category name is required" });
    }

    const [result] = await pool.query(
      "INSERT INTO product_category (category_name, description) VALUES (?, ?)",
      [category_name, description || null]
    );

    res
      .status(201)
      .json({ message: "Category created successfully", id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all categories
exports.getCategories = async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM product_category ORDER BY category_name"
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update category
exports.updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { category_name, description, status } = req.body;

    const [result] = await pool.query(
      "UPDATE product_category SET category_name=?, description=?, status=? WHERE category_id=?",
      [category_name, description, status, id]
    );

    if (result.affectedRows === 0)
      return res.status(404).json({ message: "Category not found" });

    res.json({ message: "Category updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete category
exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await pool.query(
      "DELETE FROM product_category WHERE category_id=?",
      [id]
    );

    if (result.affectedRows === 0)
      return res.status(404).json({ message: "Category not found" });

    res.json({ message: "Category deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query(
      "SELECT * FROM product_category WHERE category_id = ?",
      [id]
    );

    if (rows.length === 0)
      return res.status(404).json({ message: "Unit not found" });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
