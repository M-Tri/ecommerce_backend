// models/Product.js
import { sequelize } from '../db.js';  // Adjust the path as needed
import { DataTypes } from 'sequelize';

export const Product = sequelize.define('Product', {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
  },
  image: DataTypes.STRING,
  name: DataTypes.STRING,
  priceCents: DataTypes.INTEGER,
  ratingStars: DataTypes.FLOAT,
  ratingCount: DataTypes.INTEGER,
  keywords: DataTypes.JSON, // could be stored as text or array depending on DB
});
