import { sequelize } from '../db.js';  // Adjust the path as needed
import { DataTypes } from 'sequelize';

// models/DeliveryOption.js
export const DeliveryOption = sequelize.define('DeliveryOption', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  deliveryDays: DataTypes.INTEGER,
  priceCents: DataTypes.INTEGER,
});
