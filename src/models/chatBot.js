// src/models/Chatbot.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Chatbot = sequelize.define(
  'Chatbot',
  {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      primaryKey: true,
      autoIncrement: true
    },

    /** Texto de la pregunta/trigger (frase corta o patrón) */
    query: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notEmpty: { msg: 'La consulta (query) es obligatoria' },
        len: { args: [1, 255], msg: 'Máximo 255 caracteres' }
      }
    },

    /** Respuesta predefinida (puede contener placeholders) */
    answer: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'La respuesta no puede estar vacía' }
      }
    },

    /** Tags para búsqueda / clasificación (JSON array de strings) */
    tags: {
      type: DataTypes.JSON,
      allowNull: true,
      comment: 'Ej: ["pagos", "inscripcion"]'
    },

    /** Nivel de prioridad para coincidencias (mayor = preferir) */
    priority: {
      type: DataTypes.INTEGER.UNSIGNED,
      defaultValue: 10
    },

    /** Si true, no responder automáticamente y sugerir escalamiento */
    escalate: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      comment: 'Si true, el bot sugiere escalar a humano'
    },

    /** Marca si la entrada está activa/visible */
    active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },

    /** Opcional: referencia a documento o recurso (URL o storage key) */
    resource_link: {
      type: DataTypes.STRING(255),
      allowNull: true
    },

    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: true
    }
  },
  {
    tableName: 'chatbot_kb',
    timestamps: false,
    indexes: [
      { name: 'idx_chatbot_query', fields: ['query'] },
      { name: 'idx_chatbot_priority', fields: ['priority'] },
      { name: 'idx_chatbot_active', fields: ['active'] }
    ]
  }
);

export default Chatbot;
