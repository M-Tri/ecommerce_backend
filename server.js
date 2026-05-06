import dotenv from 'dotenv';
import app from './app.js';
import { sequelize } from './db.js';

dotenv.config();

const PORT = process.env.PORT || 3000;

try {
  await sequelize.authenticate();
  console.log('Connection to SQLite has been established successfully.');

  await sequelize.sync();
  console.log('Database synced.');

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
} catch (err) {
  console.error('Unable to start server:', err);
  process.exit(1);
}
