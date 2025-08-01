// models/DeliveryOption.js
import { DataTypes } from 'sequelize';
import { sequelize } from '../db.js';

export const DeliveryOption = sequelize.define('DeliveryOption', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
    allowNull: false
  },
  deliveryDays: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  priceCents: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
});
