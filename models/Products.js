// models/Products.js
import { DataTypes } from 'sequelize';
import { sequelize } from '../db.js';

export const Product = sequelize.define('Product', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  image: {
    type: DataTypes.STRING,
    allowNull: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: true
  },
  stars: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  ratingCount: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  priceCents: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  keywords: {
    type: DataTypes.JSON,
    allowNull: true
  }
});
