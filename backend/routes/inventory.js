const express = require('express');
const router = express.Router();
const { getPool } = require('../services/db');

router.get('/', async (req, res) => {
  try {
    const pool = await getPool();
    const [rows] = await pool.query(`
      SELECT i.inventory_id, w.warehouse_name, p.sku, p.product_name,
             i.available_qty, i.reserved_qty, i.damaged_qty
      FROM inventory i
      JOIN products p ON i.product_id = p.product_id
      JOIN warehouses w ON i.warehouse_id = w.warehouse_id
      ORDER BY p.product_name
    `);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to load inventory' });
  }
});

module.exports = router;
