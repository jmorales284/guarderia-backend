// src/models/Document.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Document = sequelize.define(
  'Document',
  {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      primaryKey: true,
      autoIncrement: true
    },
    title: {
      type: DataTypes.STRING(120),
      allowNull: false,
      validate: {
        notEmpty: { msg: 'El título del documento no puede estar vacío' },
        len: { args: [1, 120], msg: 'El título debe tener máximo 120 caracteres' }
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    file_path: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Debe indicarse la ruta o nombre del archivo' }
      }
    },
    file_type: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Debe especificarse el tipo de archivo (PDF, imagen, etc.)' }
      }
    },
    uploaded_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    family_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      references: {
        model: 'families',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  },
  {
    tableName: 'documents',
    timestamps: false,
    indexes: [
      {
        name: 'idx_document_family',
        fields: ['family_id']
      },
      {
        name: 'idx_document_title',
        fields: ['title']
      }
    ]
  }
);

export default Document;
