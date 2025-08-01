// routes/deliveryOptions.js
import express from 'express';
import { DeliveryOption } from '../models/DeliveryOptions.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const options = await DeliveryOption.findAll();
    res.json(options);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
