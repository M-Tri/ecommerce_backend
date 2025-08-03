import express from 'express';
import { CartItem, Product } from '../models/index.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { expand } = req.query;

    const include = [];
    if (expand === 'product') {
      include.push({ model: Product });
    }

    const cartItems = await CartItem.findAll({ include });

    res.json(cartItems);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;

