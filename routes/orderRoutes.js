import express from 'express';
import { Order } from '../models/Orders.js';
import { Product } from '../models/Products.js';

const router = express.Router();

// GET /orders - List all orders
router.get('/', async (req, res) => {
  try {
    const { expand } = req.query;

    let orders;
    if (expand === 'products') {
      orders = await Order.findAll({
        include: [{ model: Product }]
      });
    } else {
      orders = await Order.findAll();
    }

    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /orders/:id - Get one order by ID
router.get('/:id', async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /orders - Create a new order
router.post('/', async (req, res) => {
  try {
    // Validate required fields here, e.g., userId, items, etc.
    const newOrder = await Order.create(req.body);
    res.status(201).json(newOrder);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT /orders/:id - Update an existing order
router.put('/:id', async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    await order.update(req.body);
    res.json(order);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE /orders/:id - Delete/cancel an order
router.delete('/:id', async (req, res) => {
  try {
    const deletedCount = await Order.destroy({ where: { id: req.params.id } });
    if (deletedCount === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
