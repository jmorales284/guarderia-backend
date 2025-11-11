// src/models/MenuItem.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const MenuItem = sequelize.define(
  'MenuItem',
  {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      autoIncrement: true,
      primaryKey: true
    },
    menu_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      references: {
        model: 'menus',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    meal_type: {
      type: DataTypes.ENUM('Desayuno', 'Almuerzo', 'Merienda', 'Cena'),
      allowNull: false,
      defaultValue: 'Almuerzo'
    },
    dish_name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: { msg: 'El nombre del plato es obligatorio' }
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    allergens: {
      type: DataTypes.JSON,
      allowNull: true,
      comment: 'Lista de posibles alérgenos en el plato (por ejemplo: ["huevo", "lácteos"])'
    }
  },
  {
    tableName: 'menu_items',
    timestamps: true,
    underscored: true,
    indexes: [
      { name: 'idx_menuitem_menu_id', fields: ['menu_id'] },
      { name: 'idx_menuitem_meal_type', fields: ['meal_type'] }
    ]
  }
);

// Relaciones
MenuItem.associate = (models) => {
  MenuItem.belongsTo(models.Menu, {
    foreignKey: 'menu_id',
    as: 'menu'
  });
};

export default MenuItem;
