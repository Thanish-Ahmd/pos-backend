// routes/unitRoutes.js
const express = require('express');
const router = express.Router();

// Import controller functions
const {
  createUnit,
  getUnits,
  getUnitBySymbol,
  updateUnit,
  deleteUnit
} = require('../controllers/unitController');


// Unit Routes
router.post('/', createUnit);           // Add new unit
router.get('/', getUnits);              // Get all units
router.get('/:symbol', getUnitBySymbol); // Get single unit
router.put('/:symbol', updateUnit);     // Update description
router.delete('/:symbol', deleteUnit);  // Delete unit

module.exports = router;
