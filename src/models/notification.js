// src/models/Notification.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Notification = sequelize.define(
  'Notification',
  {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },

    /** Usuario destino de la notificación */
    user_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      comment: 'Usuario que recibe la notificación',
    },

    /** Título breve o asunto */
    title: {
      type: DataTypes.STRING(150),
      allowNull: false,
      validate: {
        notEmpty: { msg: 'El título no puede estar vacío' },
      },
    },

    /** Contenido principal del mensaje */
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'El mensaje no puede estar vacío' },
      },
    },

    /** Tipo de notificación (sistema, recordatorio, alerta, etc.) */
    type: {
      type: DataTypes.ENUM('system', 'reminder', 'alert', 'message'),
      allowNull: false,
      defaultValue: 'system',
    },

    /** Canal por el cual fue enviada (app, email, sms, etc.) */
    channel: {
      type: DataTypes.ENUM('app', 'email', 'sms', 'push'),
      allowNull: false,
      defaultValue: 'app',
    },

    /** Estado de lectura */
    is_read: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },

    /** Fecha y hora en la que se envió */
    sent_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },

    /** Fecha de lectura (si aplica) */
    read_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },

    /** Referencia a algún módulo u objeto (ej: id de reunión, evento, etc.) */
    reference_type: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: 'Tipo de objeto referenciado, ej: "event", "invoice"',
    },

    reference_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: true,
    },
  },
  {
    tableName: 'notifications',
    timestamps: false,
    indexes: [
      { name: 'idx_notifications_user', fields: ['user_id'] },
      { name: 'idx_notifications_type', fields: ['type'] },
      { name: 'idx_notifications_is_read', fields: ['is_read'] },
    ],
  }
);

export default Notification;
