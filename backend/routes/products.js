const express = require('express');
const router = express.Router();
const { getPool } = require('../services/db');

router.get('/', async (req, res) => {
  try {
    const pool = await getPool();
    const [rows] = await pool.query(`
      SELECT p.product_id, p.sku, p.product_name, p.description, p.unit_price, p.status,
             c.category_name,
             COALESCE(i.available_qty, 0) AS available_qty
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.category_id
      LEFT JOIN inventory i ON p.product_id = i.product_id
      ORDER BY p.product_name
    `);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to load products' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { sku, product_name, description, category_id, unit_price, status } = req.body;
    const pool = await getPool();
    const [result] = await pool.query(
      `INSERT INTO products (sku, product_name, description, category_id, unit_price, status)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [sku, product_name, description || '', category_id || null, unit_price || 0, status || 'ACTIVE']
    );
    res.status(201).json({ product_id: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create product' });
  }
});

module.exports = router;
