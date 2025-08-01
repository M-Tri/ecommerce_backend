import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import routes from './routes/index.js';
import { sequelize } from './db.js';
import './models/index.js';

import { defaultProducts } from './defaultData/defaultProducts.js';
import { Product } from './models/index.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

(async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection to SQLite has been established successfully.');

    // await sequelize.sync();
    await sequelize.sync({ force: true });

    console.log('Database synced.');

    // Seed products if table is empty
    const productCount = await Product.count();
    if (productCount === 0) {
      await Product.bulkCreate(defaultProducts);
      console.log('Inserted default products into database.');
    }

    app.use(cors());
    app.use(express.json());
    
    // Whenever someone visits /images/anything, go look for a matching file inside the images/ folder.
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
