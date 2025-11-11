// src/models/Meeting.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Meeting = sequelize.define(
  'Meeting',
  {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      autoIncrement: true,
      primaryKey: true
    },
    title: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: { msg: 'El título de la reunión es obligatorio' }
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    meeting_date: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        isDate: { msg: 'La fecha de la reunión debe ser válida' }
      }
    },
    location: {
      type: DataTypes.STRING(150),
      allowNull: true
    },
    created_by: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      references: {
        model: 'staff',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    },
    attendees: {
      type: DataTypes.JSON,
      allowNull: true,
      comment: 'Lista de IDs de asistentes (staff, tutores u otros)'
    },
    status: {
      type: DataTypes.ENUM('programada', 'realizada', 'cancelada'),
      allowNull: false,
      defaultValue: 'programada',
      validate: {
        isIn: {
          args: [['programada', 'realizada', 'cancelada']],
          msg: 'Estado inválido para la reunión'
        }
      }
    }
  },
  {
    tableName: 'meetings',
    timestamps: true,
    underscored: true,
    indexes: [
      { name: 'idx_meeting_date', fields: ['meeting_date'] },
      { name: 'idx_created_by', fields: ['created_by'] }
    ]
  }
);

// Relaciones (si los modelos existen)
Meeting.associate = (models) => {
  Meeting.belongsTo(models.Staff, {
    foreignKey: 'created_by',
    as: 'organizer'
  });
};

export default Meeting;
