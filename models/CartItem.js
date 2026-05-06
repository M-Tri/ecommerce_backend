import { sequelize } from '../db.js';
import { DataTypes } from 'sequelize';

// models/CartItem.js
export const CartItem = sequelize.define('CartItem', {
  productId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
      max: 10
    }
  },
  deliveryOptionId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});
