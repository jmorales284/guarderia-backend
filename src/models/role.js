// src/models/Role.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Role = sequelize.define(
  'Role',
  {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },

    /** Nombre del rol (ejemplo: "Administrador", "Docente", "Acudiente") */
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      comment: 'Nombre del rol del usuario dentro del sistema',
    },

    /** Descripción del rol */
    description: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: 'Descripción de las responsabilidades o nivel de acceso del rol',
    },

    /** Nivel jerárquico opcional (para orden o prioridad de permisos) */
    level: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
      defaultValue: 1,
      comment: 'Nivel jerárquico del rol (1 = más alto, mayor acceso)',
    },

    /** Fecha de creación automática */
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },

    /** Fecha de última actualización */
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: 'roles',
    timestamps: false,
    indexes: [{ name: 'idx_role_name', fields: ['name'] }],
  }
);

export default Role;
