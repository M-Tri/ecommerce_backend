import express from 'express';
import { home } from '../controllers/indexController.js';
import userRoutes from './userRoutes.js';

const router = express.Router();

router.get('/', home);
router.use('/users', userRoutes);

export default router;
