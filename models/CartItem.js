import { sequelize } from '../db.js';
import { DataTypes } from 'sequelize';

// models/CartItem.js
export const CartItem = sequelize.define('CartItem', {
  productId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  quantity: DataTypes.INTEGER,
  deliveryOptionId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});
