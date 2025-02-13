const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Slot = sequelize.define('Slot', {
  date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  time_slot: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  available: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  is_booked: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
});

module.exports = Slot;

