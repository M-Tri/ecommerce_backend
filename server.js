import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import routes from './routes/index.js';
import { sequelize } from './db.js';
import './models/index.js';
import { defaultProducts } from './defaultData/defaultProducts.js';
import { Product } from './models/index.js';
import { defaultDeliveryOptions } from './defaultData/defaultDeliveryOptions.js';
import { DeliveryOption } from './models/index.js';
import { defaultCartItem } from './defaultData/defaultCartItem.js';
import { CartItem } from './models/index.js';
import { defaultOrders } from './defaultData/defaultOrders.js';
import { Order } from './models/index.js';
import { OrderProduct } from './models/index.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

(async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection to SQLite has been established successfully.');

    // Reset database before inserting default data
    await sequelize.sync({ force: true });

    console.log('Database synced.');

    // Seed products if table is empty
    const productCount = await Product.count();
    if (productCount === 0) {
      const flattenedProducts = defaultProducts.map(p => ({
        ...p,
        stars: p.rating ? p.rating.stars : null,
        ratingCount: p.rating ? p.rating.count : null
      }));

      await Product.bulkCreate(flattenedProducts);
      console.log('Inserted default products into database.');
    }

    // Seed delivery options if table is empty
    const deliveryOptionCount = await DeliveryOption.count();
    if (deliveryOptionCount === 0) {
      await DeliveryOption.bulkCreate(defaultDeliveryOptions);
      console.log('Inserted default delivery options into database.');
    }

    const cartItemCount = await CartItem.count();
    if (cartItemCount === 0) {
      await CartItem.bulkCreate(defaultCartItem);
      console.log('Inserted default cart Items into database');
    }

    const OrdersCount = await Order.count();
    if (OrdersCount === 0) {
      await Order.bulkCreate(defaultOrders);
      console.log('Inserted default orders Items into database');
    }

    await Promise.all(
      defaultOrders.flatMap(order =>
        order.products.map(product =>
          OrderProduct.create({
            orderId: order.id,
            productId: product.productId,
            quantity: product.quantity,
            estimatedDeliveryTimeMs: product.estimatedDeliveryTimeMs
          })
        )
      )
    );

    app.use(cors());
    app.use(express.json());

    // Whenever someone visits .../images/anything, go look for a matching file inside the images/ folder.
    app.use('/images', express.static('images'));

    app.use('/', routes);

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });

  } catch (err) {
    console.error('Unable to connect to the database:', err);
    process.exit(1);
  }
})();
