import express from 'express';
import { CartItem } from '../models/CartItem.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const cartItem = await CartItem.findAll();
    res.json(cartItem);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
