const express = require('express');
const router = express.Router();
const { getPool } = require('../services/db');

router.get('/', async (req, res) => {
  try {
    const pool = await getPool();
    const [rows] = await pool.query(`
      SELECT o.order_id, o.order_number, o.order_channel, o.order_status, o.total_amount,
             o.created_at, c.customer_name
      FROM orders o
      LEFT JOIN customers c ON o.customer_id = c.customer_id
      ORDER BY o.created_at DESC
      LIMIT 100
    `);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to load orders' });
  }
});

router.post('/', async (req, res) => {
  const pool = await getPool();
  const conn = await pool.getConnection();
  try {
    const { customer_id, items, order_channel } = req.body;
    await conn.beginTransaction();

    const orderNumber = `FH-${Date.now()}`;
    const [orderResult] = await conn.query(
      `INSERT INTO orders (order_number, customer_id, order_channel, order_status, total_amount)
       VALUES (?, ?, ?, 'SUBMITTED', 0)`,
      [orderNumber, customer_id, order_channel || 'WEBSITE']
    );

    let total = 0;
    for (const item of items || []) {
      const [products] = await conn.query(
        'SELECT product_id, unit_price FROM products WHERE product_id = ?',
        [item.product_id]
      );
      if (!products.length) continue;
      const price = Number(products[0].unit_price);
      const qty = Number(item.quantity || 1);
      const subtotal = price * qty;
      total += subtotal;
      await conn.query(
        `INSERT INTO order_items (order_id, product_id, quantity, unit_price, subtotal)
         VALUES (?, ?, ?, ?, ?)`,
        [orderResult.insertId, item.product_id, qty, price, subtotal]
      );
    }

    await conn.query('UPDATE orders SET total_amount = ? WHERE order_id = ?', [total, orderResult.insertId]);
    await conn.commit();
    res.status(201).json({ order_id: orderResult.insertId, order_number: orderNumber, total_amount: total });
  } catch (err) {
    await conn.rollback();
    console.error(err);
    res.status(500).json({ error: 'Failed to create order' });
  } finally {
    conn.release();
  }
});

module.exports = router;
