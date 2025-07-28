import express from 'express';
import { Order } from '../models/Orders.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const orders = await Order.findAll();
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
