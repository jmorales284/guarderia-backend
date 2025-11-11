import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Family = sequelize.define(
  "Family",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    family_name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    phone_number: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: true,
      validate: {
        isEmail: true,
      },
    },
  },
  {
    tableName: "families",
    timestamps: false,
  }
);

export default Family;
