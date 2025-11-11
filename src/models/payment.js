// src/models/Payment.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Payment = sequelize.define(
  'Payment',
  {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },

    /** Factura asociada al pago */
    invoice_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      comment: 'Factura relacionada con este pago',
    },

    /** Usuario (tutor/padre) que realiza el pago */
    user_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      comment: 'Usuario que realiza el pago',
    },

    /** Monto pagado */
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0,
      },
    },

    /** Método de pago (efectivo, tarjeta, transferencia, etc.) */
    method: {
      type: DataTypes.ENUM('efectivo', 'tarjeta', 'transferencia', 'pasarela'),
      allowNull: false,
      defaultValue: 'pasarela',
    },

    /** Estado del pago */
    status: {
      type: DataTypes.ENUM('pendiente', 'completado', 'fallido', 'cancelado'),
      allowNull: false,
      defaultValue: 'pendiente',
    },

    /** Fecha del pago */
    payment_date: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },

    /** Código o referencia de la transacción (pasarela, banco, etc.) */
    transaction_reference: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },

    /** URL de comprobante o recibo */
    receipt_url: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },

    /** Observaciones opcionales */
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: 'payments',
    timestamps: false,
    indexes: [
      { name: 'idx_payment_invoice', fields: ['invoice_id'] },
      { name: 'idx_payment_user', fields: ['user_id'] },
      { name: 'idx_payment_status', fields: ['status'] },
    ],
  }
);

export default Payment;
