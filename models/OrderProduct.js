import { sequelize } from '../db.js';  // Adjust the path as needed
import { DataTypes } from 'sequelize';

// models/OrderProduct.js
export const OrderProduct = sequelize.define('OrderProduct', {
  orderId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  productId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  quantity: DataTypes.INTEGER,
  estimatedDeliveryTimeMs: DataTypes.BIGINT,
});
