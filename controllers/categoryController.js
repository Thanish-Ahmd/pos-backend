const { pool } = require("../database");

// Create new category
exports.createCategory = async (req, res) => {
  try {
    const { category_name, description, parent_category_id } = req.body;

    if (!category_name) {
      return res.status(400).json({ error: "Category name is required" });
    }

    const [result] = await pool.query(
      `INSERT INTO product_category (category_name, description, parent_category_id)
       VALUES (?, ?, ?)`,
      [category_name, description || null, parent_category_id || null]
    );

    res.status(201).json({
      message: "Category created successfully",
      id: result.insertId,
    });
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      res.status(400).json({ error: "Category name already exists" });
    } else {
      res.status(500).json({ error: err.message });
    }
  }
};

// Get all categories
exports.getCategories = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        c.category_id,
        c.category_name,
        c.description,
        c.status,
        c.parent_category_id,
        p.category_name AS parent_category_name,
        c.created_at,
        c.updated_at
      FROM product_category c
      LEFT JOIN product_category p
        ON c.parent_category_id = p.category_id
      ORDER BY c.category_name
    `);

    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update category
exports.updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { category_name, description, status, parent_category_id } = req.body;

    const [result] = await pool.query(
      `
      UPDATE product_category 
      SET category_name = ?, 
          description = ?, 
          status = ?, 
          parent_category_id = ?
      WHERE category_id = ?
      `,
      [category_name, description, status, parent_category_id || null, id]
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

// categories by id
exports.getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query(
      `
      SELECT 
        c.category_id,
        c.category_name,
        c.description,
        c.status,
        c.parent_category_id,
        p.category_name AS parent_category_name,
        c.created_at,
        c.updated_at
      FROM product_category c
      LEFT JOIN product_category p
        ON c.parent_category_id = p.category_id
      WHERE c.category_id = ?
      `,
      [id]
    );

    if (rows.length === 0)
      return res.status(404).json({ message: "Category not found" });

    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
