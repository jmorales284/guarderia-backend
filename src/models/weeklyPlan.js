// src/models/WeeklyPlan.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const WeeklyPlan = sequelize.define(
  'WeeklyPlan',
  {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      primaryKey: true,
      autoIncrement: true
    },

    classroom_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      comment: 'Aula a la que aplica el plan semanal'
    },

    week_start: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      comment: 'Fecha del lunes de la semana (YYYY-MM-DD)'
    },

    status: {
      type: DataTypes.ENUM('draft', 'published'),
      allowNull: false,
      defaultValue: 'draft',
      comment: 'Estado del plan: borrador o publicado'
    },

    created_by: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      comment: 'Usuario que creó el plan (user id)'
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
    tableName: 'weekly_plans',
    timestamps: false, // manejamos created_at/updated_at manualmente en campos
    underscored: true,
    indexes: [
      {
        name: 'uq_weekly_plan_classroom_weekstart',
        unique: true,
        fields: ['classroom_id', 'week_start']
      },
      {
        name: 'idx_weeklyplan_classroom',
        fields: ['classroom_id']
      }
    ],
    validate: {
      weekStartIsMonday() {
        if (this.week_start) {
          // Se asegura (cuando sea posible) que week_start sea un lunes.
          // Note: Date parsing aquí depende del formato 'YYYY-MM-DD'.
          const d = new Date(this.week_start + 'T00:00:00Z');
          // getUTCDay(): 0 = domingo, 1 = lunes, ...
          if (Number.isFinite(d.getTime()) && d.getUTCDay() !== 1) {
            throw new Error('week_start debe ser un lunes (YYYY-MM-DD)');
          }
        }
      }
    }
  }
);

// Asociaciones sugeridas:
// Definir en src/models/index.js tras importar todos los modelos para evitar ciclos.
// Ejemplo de uso en models/index.js:
// WeeklyPlan.belongsTo(models.Classroom, { foreignKey: 'classroom_id', as: 'classroom' });
// WeeklyPlan.belongsTo(models.User, { foreignKey: 'created_by', as: 'creator' });
// WeeklyPlan.hasMany(models.Activity, { foreignKey: 'weekly_plan_id', as: 'activities' });

export default WeeklyPlan;
