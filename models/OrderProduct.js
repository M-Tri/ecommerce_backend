// models/OrderProduct.js
import { DataTypes } from 'sequelize';
import { sequelize } from '../db.js';

export const OrderProduct = sequelize.define('OrderProduct', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  estimatedDeliveryTimeMs: {
    type: DataTypes.BIGINT,
    allowNull: false
  }
});
