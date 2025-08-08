import express from 'express';
import { home } from '../controllers/indexController.js';
import productRoutes from './productRoutes.js';
import orderRoutes from './orderRoutes.js';
import cartItemRoutes from './cartItemRoutes.js';
import deliveryOptionsRoutes from './deliveryOptionsRoutes.js';
import resetRoutes from './resetRoutes.js';
import paymentSummaryRoutes from './paymentSummaryRoutes.js';


const router = express.Router();

// Define a GET route at '/'.
// When the client visits the root path (e.g., '/'), the 'home' function handles the request.
router.get('/', home);

// api is just for clarity. It tells the client that they are using the backend.
router.use('/products', productRoutes);
router.use('/orders', orderRoutes);
router.use('/cart-items', cartItemRoutes);
router.use('/delivery-options', deliveryOptionsRoutes);
router.use('/reset', resetRoutes);
router.use('/payment-summary', paymentSummaryRoutes);

export default router;
