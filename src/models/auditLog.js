// src/models/AuditLog.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const AuditLog = sequelize.define(
  'AuditLog',
  {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      primaryKey: true,
      autoIncrement: true
    },
    entity: {
      type: DataTypes.STRING(100),
      allowNull: false,
      comment: 'Nombre de la entidad afectada (p.ej. "children", "invoices")'
    },
    entity_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      comment: 'ID del registro afectado en la entidad'
    },
    action: {
      type: DataTypes.STRING(50),
      allowNull: false,
      comment: 'Acción realizada (create, update, delete, emit_invoice, pay, role_change, etc.)'
    },
    actor_user_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: true,
      comment: 'Usuario que ejecutó la acción (si aplica)'
    },
    before_json: {
      type: DataTypes.JSON,
      allowNull: true,
      comment: 'Snapshot JSON del estado antes de la acción'
    },
    after_json: {
      type: DataTypes.JSON,
      allowNull: true,
      comment: 'Snapshot JSON del estado después de la acción'
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    details: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Información adicional libre (motivos, notas, referencia externa)'
    }
  },
  {
    tableName: 'audit_logs',
    timestamps: false,
    indexes: [
      { name: 'idx_audit_entity', fields: ['entity', 'entity_id'] },
      { name: 'idx_audit_actor', fields: ['actor_user_id'] },
      { name: 'idx_audit_action', fields: ['action'] }
    ]
  }
);

export default AuditLog;
