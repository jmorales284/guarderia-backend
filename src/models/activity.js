// src/models/Activity.js
import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

export const Activity = sequelize.define("Activity", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  startTime: {
    type: DataTypes.TIME,
    allowNull: false,
  },
  endTime: {
    type: DataTypes.TIME,
    allowNull: false,
  },
  location: {
    type: DataTypes.STRING(150),
    allowNull: true,
  },
  type: {
    type: DataTypes.ENUM("Deportiva", "Recreativa", "Educativa", "Cultural", "Otro"),
    allowNull: false,
  },
  capacity: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
});
