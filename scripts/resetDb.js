import { sequelize } from '../db.js';
import '../models/index.js';
import { seedDatabase } from './seed.js';

try {
  await sequelize.authenticate();
  await sequelize.sync({ force: true });
  await seedDatabase();
  console.log('Database reset and seed completed.');
} catch (err) {
  console.error('Unable to reset database:', err);
  process.exitCode = 1;
} finally {
  await sequelize.close();
}
