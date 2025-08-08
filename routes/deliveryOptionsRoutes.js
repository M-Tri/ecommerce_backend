import express from 'express';
import { DeliveryOption } from '../models/DeliveryOptions.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { expand } = req.query;

    const options = await DeliveryOption.findAll();

    // If expand=estimatedDeliveryTime is requested, calculate deliveryTimeMs
    const result = options.map(option => {
      const plain = option.toJSON();

      if (expand === 'estimatedDeliveryTime') {
        const currentTimeMs = Date.now();
        const estimatedDeliveryTimeMs = currentTimeMs + option.deliveryDays * 24 * 60 * 60 * 1000;

        return {
          ...plain,
          estimatedDeliveryTimeMs
        };
      }

      return plain;
    });

    res.json(result);
  } catch (err) {
    console.error('Error fetching delivery options:', err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
