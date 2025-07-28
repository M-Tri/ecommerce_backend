import express from 'express';
import { home } from '../controllers/indexController.js';
import productRoutes from './productRoutes.js';
import orderRoutes from './orderRoutes.js';
import cartRoutes from './cartRoutes.js';


const router = express.Router();

// Define a GET route at '/'.
// When the client visits the root path (e.g., '/'), the 'home' function handles the request.
router.get('/', home);

// This means any request starting with '/api/users' will be forwarded to the routes defined in 'userRoutes.js' for further handling.
// Each call be mount /users. Example: app.get('/api/users/', ..., This just adds the word '/users' to each call at the 'userRoutes' file.
//api is just for clarity. It tells the client that they are using the backend.
router.use('/api/products', productRoutes);
router.use('/api/orders', orderRoutes);
router.use('/api/cart', cartRoutes);

export default router;
