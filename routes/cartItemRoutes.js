import express from 'express';
import { CartItem, Product } from '../models/index.js';

const router = express.Router();

// GET /cart-items
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

// POST /cart-items
router.post('/', async (req, res) => {
  const { productId, quantity, deliveryOption = 1 } = req.body;

  if (!productId || typeof quantity !== 'number' || quantity <= 0) {
    return res.status(400).json({ error: 'Invalid productId or quantity' });
  }

  if (typeof quantity !== 'number' || quantity < 1 || quantity > 10) {
    return res.status(400).json({ error: 'Quantity must be a number between 1 and 10' });
  }

  try {
    const product = await Product.findByPk(productId);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    let cartItem = await CartItem.findOne({ where: { productId } });

    if (cartItem) {
      cartItem.quantity += quantity;
      cartItem.deliveryOption = deliveryOption;
      await cartItem.save();
    } else {
      cartItem = await CartItem.create({
        productId,
        quantity,
        deliveryOption
      });
    }

    res.status(201).json(cartItem);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
