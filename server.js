import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import routes from './routes/index.js';
import { sequelize } from './db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

(async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection to SQLite has been established successfully.');

    await sequelize.sync();
    console.log('Database synced.');

    app.use(cors());
    app.use(express.json());

    app.use('/', routes);

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });

  } catch (err) {
    console.error('Unable to connect to the database:', err);
    process.exit(1);
  }
})();
