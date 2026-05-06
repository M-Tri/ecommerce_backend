import express from 'express';
import cors from 'cors';
import routes from './routes/index.js';
import './models/index.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use('/images', express.static('images'));

app.get('/', (req, res) => {
  res.json({
    message: 'Ecommerce Backend API is running.',
    api: '/api',
    endpoints: [
      '/api/products',
      '/api/cart-items',
      '/api/orders',
      '/api/delivery-options',
      '/api/payment-summary'
    ]
  });
});

app.use('/api', routes);

export default app;
