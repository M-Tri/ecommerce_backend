import express from 'express';
import { home } from '../controllers/indexController.js';
import userRoutes from './userRoutes.js';

const router = express.Router();

// Define a GET route at '/'.
// When the client visits the root path (e.g., '/'), the 'home' function handles the request.
router.get('/', home);

// This means any request starting with '/users' will be forwarded to the routes defined in 'userRoutes.js' for further handling.
// Each call be mount /users. Example: app.get('/users/', ..., This just adds the word /users to each call at userRoutes.
router.use('/users', userRoutes);

export default router;
