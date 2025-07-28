import { sequelize } from '../db.js';  // Adjust the path as needed
import { DataTypes } from 'sequelize';

// models/Order.js
export const Order = sequelize.define('Order', {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
  },
  orderTimeMs: DataTypes.BIGINT,
  totalCostCents: DataTypes.INTEGER,
});
