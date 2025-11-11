// src/models/Menu.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Menu = sequelize.define(
  'Menu',
  {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      autoIncrement: true,
      primaryKey: true
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      unique: true,
      validate: {
        isDate: { msg: 'La fecha del menú debe ser válida' }
      }
    },
    title: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: { msg: 'El título del menú es obligatorio' }
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    published: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    restricted_allergens: {
      type: DataTypes.JSON,
      allowNull: true,
      comment: 'Lista de alérgenos que deben evitarse (por ejemplo: ["gluten", "lácteos"])'
    }
  },
  {
    tableName: 'menus',
    timestamps: true,
    underscored: true,
    indexes: [
      { name: 'idx_menu_date', fields: ['date'] },
      { name: 'idx_menu_published', fields: ['published'] }
    ]
  }
);

// Relaciones (si existen otros modelos)
Menu.associate = (models) => {
  Menu.hasMany(models.MenuItem, {
    foreignKey: 'menu_id',
    as: 'items'
  });
};

export default Menu;
