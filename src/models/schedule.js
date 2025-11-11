// src/models/Schedule.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Schedule = sequelize.define(
  'Schedule',
  {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(80),
      allowNull: false,
      validate: {
        notEmpty: { msg: 'El nombre del horario no puede estar vacío' },
        len: { args: [1, 80], msg: 'El nombre debe tener máximo 80 caracteres' }
      }
    },
    day_of_week: {
      // 1 = lunes ... 7 = domingo
      type: DataTypes.TINYINT,
      allowNull: false,
      validate: {
        isInt: true,
        min: 1,
        max: 7
      }
    },
    start_time: {
      type: DataTypes.TIME,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    end_time: {
      type: DataTypes.TIME,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  },
  {
    tableName: 'schedules',
    timestamps: false,
    indexes: [
      {
        unique: true,
        name: 'uq_schedule_name_day_start_end',
        fields: ['name', 'day_of_week', 'start_time', 'end_time']
      },
      {
        name: 'idx_schedule_day_time',
        fields: ['day_of_week', 'start_time', 'end_time']
      }
    ],
    validate: {
      startBeforeEnd() {
        if (this.start_time && this.end_time) {
          // Comparar como strings HH:MM:SS es válido para TIME en formato 24h
          if (this.start_time >= this.end_time) {
            throw new Error('start_time debe ser menor que end_time');
          }
        }
      }
    }
  }
);

export default Schedule;
