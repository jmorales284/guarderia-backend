// src/models/Permission.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Permission = sequelize.define(
  'Permission',
  {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },

    /** Nombre interno del permiso (ejemplo: "crear_usuario", "editar_aula") */
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      comment: 'Identificador técnico del permiso',
    },

    /** Descripción del permiso */
    description: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: 'Descripción del permiso y su uso dentro del sistema',
    },

    /** Módulo o categoría al que pertenece (opcional) */
    module: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: 'Módulo del sistema al que pertenece el permiso',
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
    tableName: 'permissions',
    timestamps: false,
    indexes: [
      { name: 'idx_permission_name', fields: ['name'] },
      { name: 'idx_permission_module', fields: ['module'] },
    ],
  }
);

export default Permission;
