import express from 'express';
import { Order } from '../models/Orders.js';
import { Product } from '../models/Products.js';
import { DeliveryOption } from '../models/DeliveryOptions.js';
import { OrderProduct } from '../models/OrderProduct.js';
import { CartItem } from '../models/CartItem.js';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    // Delete all rows from each table
    await OrderProduct.destroy({ where: {}, truncate: true, cascade: true });
    await CartItem.destroy({ where: {}, truncate: true, cascade: true });
    await Order.destroy({ where: {}, truncate: true, cascade: true });
    await Product.destroy({ where: {}, truncate: true, cascade: true });
    await DeliveryOption.destroy({ where: {}, truncate: true, cascade: true });

    res.status(200).json({ message: 'Database reset successfully' });
  } catch (error) {
    console.error('Error resetting database:', error);
    res.status(500).json({ error: 'Failed to reset database' });
  }
});

export default router;
