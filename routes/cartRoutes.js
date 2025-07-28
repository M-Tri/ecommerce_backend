import express from 'express';
import { CartItem } from '../models/Cart.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const cart = await CartItem.findAll();
    res.json(cart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
