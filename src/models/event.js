// src/models/Event.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Event = sequelize.define(
  'Event',
  {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      primaryKey: true,
      autoIncrement: true
    },
    title: {
      type: DataTypes.STRING(150),
      allowNull: false,
      validate: {
        notEmpty: { msg: 'El título del evento no puede estar vacío' }
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    start_date: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        isDate: { msg: 'Debe ser una fecha válida' }
      }
    },
    end_date: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        isDate: { msg: 'Debe ser una fecha válida' }
      }
    },
    location: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    created_by: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    },
    status: {
      type: DataTypes.ENUM('draft', 'published', 'closed'),
      defaultValue: 'draft'
    },
    capacity: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
      validate: {
        min: { args: [1], msg: 'La capacidad mínima debe ser 1' }
      }
    },
    active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  },
  {
    tableName: 'events',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
      { name: 'idx_event_title', fields: ['title'] },
      { name: 'idx_event_status', fields: ['status'] }
    ]
  }
);

export default Event;
