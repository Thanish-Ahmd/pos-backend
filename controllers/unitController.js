// controllers/unitController.js
const { pool } = require('../database');


// Create new unit
exports.createUnit = async (req, res) => {
  try {
    const { unit_symbol, description } = req.body;

    if (!unit_symbol) {
      return res.status(400).json({ error: 'unit_symbol is required' });
    }

    const [result] = await pool.query(
      'INSERT INTO unit_type (unit_symbol, description) VALUES (?, ?)',
      [unit_symbol, description || null]
    );

    res.status(201).json({ message: 'Unit created successfully', symbol: unit_symbol });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      res.status(400).json({ error: 'Unit symbol already exists' });
    } else {
      res.status(500).json({ error: err.message });
    }
  }
};


// Get all units
exports.getUnits = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM unit_type ORDER BY unit_symbol');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// Get single unit by symbol
exports.getUnitBySymbol = async (req, res) => {
  try {
    const { symbol } = req.params;
    const [rows] = await pool.query('SELECT * FROM unit_type WHERE unit_symbol = ?', [symbol]);

    if (rows.length === 0) return res.status(404).json({ message: 'Unit not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// Update unit description
exports.updateUnit = async (req, res) => {
  try {
    const { symbol } = req.params;
    const { description } = req.body;

    const [result] = await pool.query(
      'UPDATE unit_type SET description = ? WHERE unit_symbol = ?',
      [description, symbol]
    );

    if (result.affectedRows === 0) return res.status(404).json({ message: 'Unit not found' });
    res.json({ message: 'Unit updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// Delete unit
exports.deleteUnit = async (req, res) => {
  try {
    const { symbol } = req.params;

    const [result] = await pool.query('DELETE FROM unit_type WHERE unit_symbol = ?', [symbol]);

    if (result.affectedRows === 0) return res.status(404).json({ message: 'Unit not found' });
    res.json({ message: 'Unit deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
