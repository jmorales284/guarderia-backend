// src/models/EventRegistration.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import Event from './event.js';
import Child from './Child.js';

const EventRegistration = sequelize.define(
  'EventRegistration',
  {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      primaryKey: true,
      autoIncrement: true
    },
    event_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      references: {
        model: Event,
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    child_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      references: {
        model: Child,
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    registration_date: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    status: {
      type: DataTypes.ENUM('registered', 'cancelled', 'attended'),
      defaultValue: 'registered'
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  },
  {
    tableName: 'event_registrations',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
      { name: 'idx_event_registration_event', fields: ['event_id'] },
      { name: 'idx_event_registration_child', fields: ['child_id'] }
    ]
  }
);

// Relaciones
EventRegistration.belongsTo(Event, { foreignKey: 'event_id', as: 'event' });
EventRegistration.belongsTo(Child, { foreignKey: 'child_id', as: 'child' });
Event.hasMany(EventRegistration, { foreignKey: 'event_id', as: 'registrations' });
Child.hasMany(EventRegistration, { foreignKey: 'child_id', as: 'registrations' });

export default EventRegistration;
