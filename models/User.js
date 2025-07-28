import { DataTypes } from 'sequelize';
import { sequelize } from '../db.js'; 

//It defines a database table called User. The table have two columns: name and email.
// Sequelize automatically adds methods like findAll(), create(), and findByPk() to the model.
export const User = sequelize.define('User', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
});
