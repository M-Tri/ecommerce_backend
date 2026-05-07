import { beforeEach, describe, expect, it } from 'vitest';
import app from '../app.js';
import { sequelize } from '../db.js';
import { seedDatabase } from '../scripts/seed.js';
import { requestApp } from './helpers/requestApp.js';

beforeEach(async () => {
  process.env.ADMIN_SECRET = 'test-admin-secret';
  await sequelize.sync({ force: true });
  await seedDatabase();
});

describe('products API', () => {
  it('GET /api/products returns seeded products', async () => {
    const response = await requestApp(app, {
      method: 'GET',
      url: '/api/products'
    });

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveLength(5);
    expect(response.body[0]).toHaveProperty('id');
    expect(response.body[0]).toHaveProperty('name');
    expect(response.body[0]).toHaveProperty('priceCents');
  });

  it('GET /api/products?search=shirt filters products', async () => {
    const response = await requestApp(app, {
      method: 'GET',
      url: '/api/products?search=shirt'
    });

    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBeGreaterThan(0);
    expect(response.body.every(product =>
      product.name.toLowerCase().includes('shirt') ||
      product.keywords.some(keyword => keyword.toLowerCase().includes('shirt'))
    )).toBe(true);
  });

  it('POST /api/products rejects requests without admin secret', async () => {
    const response = await requestApp(app, {
      method: 'POST',
      url: '/api/products',
      body: {
        name: 'Mechanical Keyboard',
        image: 'images/products/keyboard.jpg',
        priceCents: 4999,
        keywords: ['keyboard', 'electronics']
      }
    });

    expect(response.statusCode).toBe(401);
    expect(response.body.error).toBe('Missing admin secret');
  });

  it('POST /api/products creates a product with admin secret', async () => {
    const response = await requestApp(app, {
      method: 'POST',
      url: '/api/products',
      headers: {
        'x-admin-secret': 'test-admin-secret'
      },
      body: {
        name: 'Mechanical Keyboard',
        image: 'images/products/keyboard.jpg',
        priceCents: 4999,
        keywords: ['keyboard', 'electronics']
      }
    });

    expect(response.statusCode).toBe(201);
    expect(response.body.name).toBe('Mechanical Keyboard');
    expect(response.body.priceCents).toBe(4999);
  });
});
