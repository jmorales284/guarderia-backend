// src/models/Invoice.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import Payment from './Payment.js'; // relación opcional (si ya existe el modelo)

const Invoice = sequelize.define(
  'Invoice',
  {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      primaryKey: true,
      autoIncrement: true
    },
    family_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      references: {
        model: 'families',
        key: 'id'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    },
    invoice_number: {
      type: DataTypes.STRING(30),
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: { msg: 'El número de factura es obligatorio' }
      }
    },
    issue_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      validate: {
        isDate: { msg: 'La fecha de emisión debe tener un formato válido (YYYY-MM-DD)' }
      }
    },
    due_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      validate: {
        isDate: { msg: 'La fecha de vencimiento debe tener un formato válido (YYYY-MM-DD)' }
      }
    },
    total_amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.0,
      validate: {
        isDecimal: { msg: 'El total debe ser un número decimal válido' },
        min: { args: [0], msg: 'El total no puede ser negativo' }
      }
    },
    status: {
      type: DataTypes.ENUM('pendiente', 'pagada', 'vencida', 'anulada'),
      allowNull: false,
      defaultValue: 'pendiente',
      validate: {
        isIn: {
          args: [['pendiente', 'pagada', 'vencida', 'anulada']],
          msg: 'Estado inválido'
        }
      }
    },
    notes: {
      type: DataTypes.STRING(255),
      allowNull: true
    }
  },
  {
    tableName: 'invoices',
    timestamps: true,
    underscored: true,
    indexes: [
      { name: 'uq_invoice_number', unique: true, fields: ['invoice_number'] },
      { name: 'idx_family_invoice', fields: ['family_id'] }
    ]
  }
);

// Relaciones (si los modelos existen)
Invoice.associate = (models) => {
  Invoice.belongsTo(models.Family, {
    foreignKey: 'family_id',
    as: 'family'
  });

  Invoice.hasMany(models.Payment, {
    foreignKey: 'invoice_id',
    as: 'payments'
  });
};

export default Invoice;
