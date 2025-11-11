// src/models/Holiday.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Holiday = sequelize.define(
  'Holiday',
  {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      primaryKey: true,
      autoIncrement: true
    },
    holiday_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: { msg: 'La fecha del festivo es requerida' },
        isDate: { msg: 'La fecha debe tener un formato válido (YYYY-MM-DD)' }
      }
    },
    description: {
      type: DataTypes.STRING(180),
      allowNull: true,
      validate: {
        len: { args: [0, 180], msg: 'La descripción puede tener máximo 180 caracteres' }
      }
    },
    active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  },
  {
    tableName: 'holidays',
    timestamps: false,
    indexes: [
      { name: 'uq_holiday_date', unique: true, fields: ['holiday_date'] }
    ],
    validate: {
      // ejemplo: no permitir fecha NULL y asegurar formato; Sequelize's isDate ya hace la validación,
      // aquí dejamos una comprobación adicional por si se necesita lógica extra en el futuro.
      holidayDatePresent() {
        if (!this.holiday_date) {
          throw new Error('holiday_date es obligatorio');
        }
      }
    }
  }
);

export default Holiday;
