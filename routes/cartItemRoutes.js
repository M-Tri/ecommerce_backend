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
  const { productId, quantity } = req.body;
  const deliveryOptionId = req.body.deliveryOptionId ?? req.body.deliveryOption ?? '1';

  if (!productId || !Number.isInteger(quantity) || quantity < 1 || quantity > 10) {
    return res.status(400).json({ error: 'Invalid productId or quantity' });
  }

  try {
    const product = await Product.findByPk(productId);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    let cartItem = await CartItem.findOne({ where: { productId } });

    if (cartItem) {
      cartItem.quantity = Math.min(cartItem.quantity + quantity, 10);
      cartItem.deliveryOptionId = deliveryOptionId;
      await cartItem.save();
    } else {
      cartItem = await CartItem.create({
        productId,
        quantity,
        deliveryOptionId
      });
    }

    res.status(201).json(cartItem);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /cart-items/:productId
router.put('/:productId', async (req, res) => {
  const { productId } = req.params;
  const { quantity, deliveryOptionId } = req.body;

  if (quantity === undefined && deliveryOptionId === undefined) {
    return res.status(400).json({ error: 'At least one field (quantity or deliveryOptionId) must be provided' });
  }

  if (quantity !== undefined && (!Number.isInteger(quantity) || quantity < 1 || quantity > 10)) {
    return res.status(400).json({ error: 'Quantity must be an integer between 1 and 10' });
  }

  try {
    const cartItem = await CartItem.findOne({ where: { productId } });

    if (!cartItem) {
      return res.status(404).json({ error: 'Cart item not found' });
    }

    if (quantity !== undefined) {
      cartItem.quantity = quantity;
    }
    if (deliveryOptionId !== undefined) {
      cartItem.deliveryOptionId = deliveryOptionId;
    }

    await cartItem.save();
    res.json(cartItem);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /cart-items/:productId
router.get('/:productId', async (req, res) => {
  const { productId } = req.params;

  try {
    const cartItem = await CartItem.findOne({ where: { productId } });

    if (!cartItem) {
      return res.status(404).json({ error: 'Cart item not found' });
    }

    res.json(cartItem);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /cart-items/:productId
router.delete('/:productId', async (req, res) => {
  const { productId } = req.params;

  try {
    const deletedCount = await CartItem.destroy({ where: { productId } });

    if (deletedCount === 0) {
      return res.status(404).json({ error: 'Cart item not found' });
    }

    res.status(204).send(); // No Content
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


export default router;
