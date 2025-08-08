import express from 'express';
import { Order } from '../models/Orders.js';
import { Product } from '../models/Products.js';
import { DeliveryOption } from '../models/DeliveryOptions.js';
import { OrderProduct } from '../models/OrderProduct.js';

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
    const { products, deliveryOptionId } = req.body;

    if (!products || !Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ error: 'Cart must contain products' });
    }
    
    // Fetch products from DB to validate and get prices
    const productIds = products.map(p => p.productId);
    const dbProducts = await Product.findAll({
      where: { id: productIds }
    });

    if (dbProducts.length !== products.length) {
      return res.status(400).json({ error: 'Some products do not exist' });
    }

    // Validate delivery option
    const deliveryOption = await DeliveryOption.findByPk(deliveryOptionId);
    if (!deliveryOption) {
      return res.status(400).json({ error: 'Invalid delivery option' });
    }

    // Calculate subtotal (products)
    let subtotalCents = 0;
    products.forEach(cartItem => {
      const product = dbProducts.find(p => p.id === cartItem.productId);
      subtotalCents += product.priceCents * cartItem.quantity;
    });

    // Add shipping cost
    const shippingCents = deliveryOption.priceCents;

    // Calculate tax (10% on subtotal + shipping)
    const taxCents = Math.round((subtotalCents + shippingCents) * 0.10);

    const totalCostCents = subtotalCents + shippingCents + taxCents;

    // Create Order record
    const newOrder = await Order.create({
      orderTimeMs: Date.now(),
      totalCostCents,
      deliveryOptionId,
    });

    // Create OrderProduct entries (associating products with this order)
    const orderProductsPromises = products.map(cartItem =>
      OrderProduct.create({
        orderId: newOrder.id,
        productId: cartItem.productId,
        quantity: cartItem.quantity,
        estimatedDeliveryTimeMs: Date.now() + (deliveryOption.deliveryDays * 24 * 60 * 60 * 1000), // example ETA
      })
    );

    await Promise.all(orderProductsPromises);

    return res.status(201).json(newOrder);

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
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
