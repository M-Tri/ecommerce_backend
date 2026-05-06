import { pathToFileURL } from 'url';
import { sequelize } from '../db.js';
import {
  CartItem,
  DeliveryOption,
  Order,
  OrderProduct,
  Product
} from '../models/index.js';
import { defaultProducts } from '../defaultData/defaultProducts.js';
import { defaultDeliveryOptions } from '../defaultData/defaultDeliveryOptions.js';
import { defaultCartItem } from '../defaultData/defaultCartItem.js';
import { defaultOrders } from '../defaultData/defaultOrders.js';

const flattenProduct = product => ({
  ...product,
  stars: product.rating ? product.rating.stars : null,
  ratingCount: product.rating ? product.rating.count : null
});

export const seedDatabase = async () => {
  const productCount = await Product.count();
  if (productCount === 0) {
    await Product.bulkCreate(defaultProducts.map(flattenProduct));
    console.log('Inserted default products into database.');
  }

  const deliveryOptionCount = await DeliveryOption.count();
  if (deliveryOptionCount === 0) {
    await DeliveryOption.bulkCreate(defaultDeliveryOptions);
    console.log('Inserted default delivery options into database.');
  }

  const cartItemCount = await CartItem.count();
  if (cartItemCount === 0) {
    await CartItem.bulkCreate(defaultCartItem);
    console.log('Inserted default cart items into database.');
  }

  const orderCount = await Order.count();
  if (orderCount === 0) {
    await Order.bulkCreate(defaultOrders.map(order => ({
      id: order.id,
      orderTimeMs: order.orderTimeMs,
      totalCostCents: order.totalCostCents
    })));
    console.log('Inserted default orders into database.');
  }

  const orderProductCount = await OrderProduct.count();
  if (orderProductCount === 0) {
    await OrderProduct.bulkCreate(
      defaultOrders.flatMap(order =>
        order.products.map(product => ({
          orderId: order.id,
          productId: product.productId,
          quantity: product.quantity,
          estimatedDeliveryTimeMs: product.estimatedDeliveryTimeMs
        }))
      )
    );
    console.log('Inserted default order products into database.');
  }
};

const isDirectRun = process.argv[1] &&
  import.meta.url === pathToFileURL(process.argv[1]).href;

if (isDirectRun) {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    await seedDatabase();
    console.log('Database seed completed.');
  } catch (err) {
    console.error('Unable to seed database:', err);
    process.exitCode = 1;
  } finally {
    await sequelize.close();
  }
}
