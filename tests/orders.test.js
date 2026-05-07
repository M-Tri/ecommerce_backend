import { beforeEach, describe, expect, it } from 'vitest';
import app from '../app.js';
import { sequelize } from '../db.js';
import { Order } from '../models/index.js';
import { seedDatabase } from '../scripts/seed.js';
import { requestApp } from './helpers/requestApp.js';

const orderId = '27cba69d-4c3d-4098-b42d-ac7fa62b7664';

beforeEach(async () => {
  process.env.ADMIN_SECRET = 'test-admin-secret';
  await sequelize.sync({ force: true });
  await seedDatabase();
});

describe('orders API', () => {
  it('PUT /api/orders/:id rejects requests without admin secret', async () => {
    const response = await requestApp(app, {
      method: 'PUT',
      url: `/api/orders/${orderId}`,
      body: {
        cart: [
          {
            productId: '83d4ca15-0f35-48f5-b7a3-1ea210004f2e',
            quantity: 1,
            deliveryOptionId: '1'
          }
        ]
      }
    });

    expect(response.statusCode).toBe(401);
    expect(response.body.error).toBe('Missing admin secret');
  });

  it('DELETE /api/orders/:id rejects requests without admin secret', async () => {
    const response = await requestApp(app, {
      method: 'DELETE',
      url: `/api/orders/${orderId}`
    });

    expect(response.statusCode).toBe(401);
    expect(response.body.error).toBe('Missing admin secret');
  });

  it('DELETE /api/orders/:id deletes an order with admin secret', async () => {
    const response = await requestApp(app, {
      method: 'DELETE',
      url: `/api/orders/${orderId}`,
      headers: {
        'x-admin-secret': 'test-admin-secret'
      }
    });

    expect(response.statusCode).toBe(204);

    const deletedOrder = await Order.findByPk(orderId);
    expect(deletedOrder).toBeNull();
  });
});
