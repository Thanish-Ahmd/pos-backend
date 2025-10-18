const { pool } = require("../database");

// Utility: Generate batch_id (productId + datetime)
const generateBatchId = (productId) => {
  const now = new Date();
  const formatted =
    now.getFullYear().toString() +
    ("0" + (now.getMonth() + 1)).slice(-2) +
    ("0" + now.getDate()).slice(-2) +
    "-" +
    ("0" + now.getHours()).slice(-2) +
    ("0" + now.getMinutes()).slice(-2) +
    ("0" + now.getSeconds()).slice(-2);
  return `P${productId}-${formatted}`;
};

// Format any input date string to YYYY-MM-DD (MySQL-compatible)
const formatDateOnly = (value) => {
  if (!value) return null;
  const date = new Date(value);
  if (isNaN(date.getTime())) return null; // invalid date check
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`; // always YYYY-MM-DD
};

//create batch
exports.createBatch = async (req, res) => {
  try {
    const {
      product_id,
      cost_price,
      selling_price,
      quantity_received,
      expiry_date,
      purchase_date,
    } = req.body;

    if (!product_id || !cost_price || !selling_price) {
      return res.status(400).json({
        error: "product_id, cost_price, and selling_price are required.",
      });
    }

    const batch_id = generateBatchId(product_id);

    // If purchase_date not provided → use today’s date (YYYY-MM-DD)
    const today = new Date().toLocaleDateString("en-CA");
    const finalPurchaseDate = purchase_date || today;

    await pool.query(
      `INSERT INTO product_batch 
       (batch_id, product_id, cost_price, selling_price, quantity_received, expiry_date, purchase_date)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        batch_id,
        product_id,
        cost_price,
        selling_price,
        quantity_received || 0,
        expiry_date || null,
        finalPurchaseDate,
      ]
    );

    res.status(201).json({
      message: "Batch created successfully",
      batch_id,
      purchase_date: finalPurchaseDate,
      expiry_date: expiry_date || null,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all batches
exports.getAllBatches = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT b.*, p.product_name, p.product_code 
       FROM product_batch b
       JOIN product p ON b.product_id = p.product_id
       ORDER BY b.created_at DESC`
    );

    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get batch by batch_id
exports.getBatchById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query(
      `SELECT b.*, p.product_name, p.product_code
       FROM product_batch b
       JOIN product p ON b.product_id = p.product_id
       WHERE b.batch_id = ?`,
      [id]
    );

    if (rows.length === 0)
      return res.status(404).json({ message: "Batch not found" });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get batches by product_id
exports.getBatchesByProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const [rows] = await pool.query(
      `SELECT * FROM product_batch WHERE product_id = ? ORDER BY created_at DESC`,
      [productId]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update batch
exports.updateBatch = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      cost_price,
      selling_price,
      quantity_received,
      quantity_sold,
      expiry_date,
      purchase_date,
    } = req.body;

    const [result] = await pool.query(
      `UPDATE product_batch 
       SET cost_price = ?, 
           selling_price = ?, 
           quantity_received = ?, 
           quantity_sold = ?, 
           expiry_date = ?, 
           purchase_date = ?
       WHERE batch_id = ?`,
      [
        cost_price,
        selling_price,
        quantity_received,
        quantity_sold,
        expiry_date,
        purchase_date,
        id,
      ]
    );

    if (result.affectedRows === 0)
      return res.status(404).json({ message: "Batch not found" });

    res.json({ message: "Batch updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete batch
exports.deleteBatch = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await pool.query(
      "DELETE FROM product_batch WHERE batch_id = ?",
      [id]
    );

    if (result.affectedRows === 0)
      return res.status(404).json({ message: "Batch not found" });

    res.json({ message: "Batch deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
