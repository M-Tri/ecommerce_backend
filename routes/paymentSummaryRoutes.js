import express from 'express';
import { CartItem, Product, DeliveryOption } from '../models/index.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const cartItems = await CartItem.findAll({
      include: [Product, DeliveryOption]
    });

    let totalItems = 0;
    let productCostCents = 0;
    let shippingCostCents = 0;

    for (const item of cartItems) {
      const quantity = item.quantity || 0;
      const productPrice = item.Product?.priceCents || 0;
      const shippingPrice = item.DeliveryOption?.priceCents || 0;

      totalItems += quantity;
      productCostCents += productPrice * quantity;
      shippingCostCents += shippingPrice;
    }

    const totalBeforeTaxCents = productCostCents + shippingCostCents;
    const taxCents = Math.round(totalBeforeTaxCents * 0.1); // 10% tax
    const totalCostCents = totalBeforeTaxCents + taxCents;

    res.status(200).json({
      totalItems,
      productCostCents,
      shippingCostCents,
      totalBeforeTaxCents,
      taxCents,
      totalCostCents
    });
  } catch (err) {
    console.error('Error generating payment summary:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
