import { beforeEach, describe, expect, it } from 'vitest';
import app from '../app.js';
import { sequelize } from '../db.js';
import { CartItem } from '../models/index.js';
import { seedDatabase } from '../scripts/seed.js';
import { requestApp } from './helpers/requestApp.js';

const productId = 'a434b69f-1bc1-482d-9ce7-cd7f4a66ce8d';

beforeEach(async () => {
  await sequelize.sync({ force: true });
  await seedDatabase();
});

describe('cart items API', () => {
  it('POST /api/cart-items adds a valid item to the cart', async () => {
    const response = await requestApp(app, {
      method: 'POST',
      url: '/api/cart-items',
      body: {
        productId,
        quantity: 2,
        deliveryOptionId: '2'
      }
    });

    expect(response.statusCode).toBe(201);
    expect(response.body.productId).toBe(productId);
    expect(response.body.quantity).toBe(2);
    expect(response.body.deliveryOptionId).toBe('2');

    const cartItem = await CartItem.findOne({ where: { productId } });
    expect(cartItem.quantity).toBe(2);
  });

  it('POST /api/cart-items rejects invalid quantity', async () => {
    const response = await requestApp(app, {
      method: 'POST',
      url: '/api/cart-items',
      body: {
        productId,
        quantity: 0
      }
    });

    expect(response.statusCode).toBe(400);
    expect(response.body.error).toBe('Invalid productId or quantity');
  });
});
