import express from 'express';
import { Order } from '../models/Orders.js';
import { Product } from '../models/Products.js';
import { DeliveryOption } from '../models/DeliveryOptions.js';
import { OrderProduct } from '../models/OrderProduct.js';
import { CartItem } from '../models/CartItem.js';


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
    const { expand } = req.query;

    const order = await Order.findByPk(req.params.id);

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    if (expand === 'products') {
      const orderProducts = await OrderProduct.findAll({
        where: { orderId: order.id },
        attributes: ['productId', 'quantity', 'estimatedDeliveryTimeMs'],
        include: [{
          model: Product,
          attributes: ['id', 'image', 'name', 'priceCents', 'keywords', 'stars', 'ratingCount']
        }]
      });

      // Format the response to match your desired structure
      const products = orderProducts.map(op => {
        const p = op.Product;
        return {
          productId: op.productId,
          quantity: op.quantity,
          estimatedDeliveryTimeMs: op.estimatedDeliveryTimeMs,
          productDetails: {
            id: p.id,
            image: p.image,
            name: p.name,
            priceCents: p.priceCents,
            keywords: p.keywords,
            rating: {
              stars: p.stars || 0,
              count: p.ratingCount || 0
            }
          }
        };
      });

      return res.json({
        id: order.id,
        orderTimeMs: order.orderTimeMs,
        totalCostCents: order.totalCostCents,
        products
      });
    } else {
      // If no expand param, just return order without product details
      return res.json(order);
    }

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});



router.post('/', async (req, res) => {
  try {
    const { cart } = req.body;

    if (!cart || !Array.isArray(cart) || cart.length === 0) {
      return res.status(400).json({ error: 'Cart must contain products' });
    }

    const productIds = cart.map(item => item.productId);
    const dbProducts = await Product.findAll({ where: { id: productIds } });

    if (dbProducts.length !== cart.length) {
      return res.status(400).json({ error: 'Some products do not exist' });
    }

    const deliveryOptionIds = [...new Set(cart.map(item => item.deliveryOptionId))];
    const deliveryOptions = await DeliveryOption.findAll({
      where: { id: deliveryOptionIds }
    });

    if (deliveryOptions.length !== deliveryOptionIds.length) {
      return res.status(400).json({ error: 'One or more delivery options are invalid' });
    }

    let subtotalCents = 0;
    let totalShippingCents = 0;

    const orderProductData = cart.map(item => {
      const product = dbProducts.find(p => p.id === item.productId);
      const delivery = deliveryOptions.find(d => d.id === item.deliveryOptionId);

      const productTotal = product.priceCents * item.quantity;
      subtotalCents += productTotal;
      totalShippingCents += delivery.priceCents;

      return {
        productId: item.productId,
        quantity: item.quantity,
        deliveryOptionId: item.deliveryOptionId,
        estimatedDeliveryTimeMs: Date.now() + (delivery.deliveryDays * 24 * 60 * 60 * 1000),
      };
    });

    const taxCents = Math.round((subtotalCents + totalShippingCents) * 0.10);
    const totalCostCents = subtotalCents + totalShippingCents + taxCents;

    // Create the Order
    const newOrder = await Order.create({
      orderTimeMs: Date.now(),
      totalCostCents
    });

    // Store each OrderProduct
    await Promise.all(orderProductData.map(item =>
      OrderProduct.create({
        orderId: newOrder.id,
        productId: item.productId,
        quantity: item.quantity,
        estimatedDeliveryTimeMs: item.estimatedDeliveryTimeMs
      })
    ));

    // Remove the products from the CartItem table
    await CartItem.destroy({
      where: {
        productId: productIds
      }
    });

    // Build response
    const response = {
      id: newOrder.id,
      orderTimeMs: newOrder.orderTimeMs,
      totalCostCents: newOrder.totalCostCents,
      products: orderProductData.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
        estimatedDeliveryTimeMs: item.estimatedDeliveryTimeMs
      }))
    };

    return res.status(201).json(response);

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});


// PUT /orders/:id
router.put('/:id', async (req, res) => {
  try {
    const { cart } = req.body;
    const order = await Order.findByPk(req.params.id);

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    if (!cart || !Array.isArray(cart) || cart.length === 0) {
      return res.status(400).json({ error: 'Cart must contain products' });
    }

    // Same logic as POST: fetch products, delivery options, recalculate costs
    const productIds = cart.map(item => item.productId);
    const dbProducts = await Product.findAll({ where: { id: productIds } });

    const deliveryOptionIds = [...new Set(cart.map(item => item.deliveryOptionId))];
    const deliveryOptions = await DeliveryOption.findAll({
      where: { id: deliveryOptionIds }
    });

    if (dbProducts.length !== cart.length || deliveryOptions.length !== deliveryOptionIds.length) {
      return res.status(400).json({ error: 'Invalid products or delivery options' });
    }

    let subtotalCents = 0;
    let totalShippingCents = 0;

    const updatedItems = cart.map(item => {
      const product = dbProducts.find(p => p.id === item.productId);
      const delivery = deliveryOptions.find(d => d.id === item.deliveryOptionId);

      subtotalCents += product.priceCents * item.quantity;
      totalShippingCents += delivery.priceCents;

      return {
        productId: item.productId,
        quantity: item.quantity,
        estimatedDeliveryTimeMs: Date.now() + (delivery.deliveryDays * 24 * 60 * 60 * 1000)
      };
    });

    const taxCents = Math.round((subtotalCents + totalShippingCents) * 0.1);
    const totalCostCents = subtotalCents + totalShippingCents + taxCents;

    // Update order cost and time
    await order.update({
      orderTimeMs: Date.now(),
      totalCostCents
    });

    // Clear existing OrderProducts
    await OrderProduct.destroy({ where: { orderId: order.id } });

    // Create new ones
    await Promise.all(updatedItems.map(item =>
      OrderProduct.create({
        orderId: order.id,
        productId: item.productId,
        quantity: item.quantity,
        estimatedDeliveryTimeMs: item.estimatedDeliveryTimeMs
      })
    ));

    return res.json({
      id: order.id,
      orderTimeMs: order.orderTimeMs,
      totalCostCents: order.totalCostCents,
      products: updatedItems
    });

  } catch (err) {
    console.error(err);
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
