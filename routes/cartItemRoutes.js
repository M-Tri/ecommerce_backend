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

// PUT /cart-items/:productId
router.put('/:productId', async (req, res) => {
  const { productId } = req.params;
  const { quantity, deliveryOption } = req.body;

  if (!quantity && !deliveryOption) {
    return res.status(400).json({ error: 'At least one field (quantity or deliveryOption) must be provided' });
  }

  if (quantity !== undefined && (typeof quantity !== 'number' || quantity < 1 || quantity > 10)) {
    return res.status(400).json({ error: 'Quantity must be a number between 1 and 10' });
  }

  try {
    const cartItem = await CartItem.findOne({ where: { productId } });

    if (!cartItem) {
      return res.status(404).json({ error: 'Cart item not found' });
    }

    if (quantity !== undefined) {
      cartItem.quantity = quantity;
    }
    if (deliveryOption !== undefined) {
      cartItem.deliveryOption = deliveryOption;
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
