// src/models/User.js
import { DataTypes } from 'sequelize';
import bcrypt from 'bcryptjs';
import sequelize from '../config/database.js';
import config from '../config/index.js'; // si guardas rounds en config.auth.passwordRounds

const PASSWORD_ROUNDS = (config && config.auth && config.auth.passwordRounds) ? config.auth.passwordRounds : 10;

const User = sequelize.define(
  'User',
  {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(120),
      allowNull: false,
      validate: { notEmpty: true }
    },
    email: {
      type: DataTypes.STRING(160),
      allowNull: false,
      unique: true,
      validate: { isEmail: true, notEmpty: true }
    },
    phone: {
      type: DataTypes.STRING(40),
      allowNull: true
    },
    password_hash: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    mfa_enabled: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    status: {
      type: DataTypes.ENUM('active','inactive'),
      defaultValue: 'active'
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    deleted_at: {
      type: DataTypes.DATE,
      allowNull: true
    }
  },
  {
    tableName: 'users',
    timestamps: false,
    indexes: [
      { name: 'uq_users_email', unique: true, fields: ['email'] },
      { name: 'idx_users_status', fields: ['status'] }
    ],
    underscored: true
  }
);

// Hook: antes de crear/actualizar, hashear password si se pasa 'password' virtual
// Para facilitar, soportamos setear user.password (no persistido) y guardarlo en password_hash
User.beforeCreate(async (user, options) => {
  if (user.password) {
    const salt = await bcrypt.genSalt(PASSWORD_ROUNDS);
    user.password_hash = await bcrypt.hash(user.password, salt);
  }
});

User.beforeUpdate(async (user, options) => {
  // Si se modificó la propiedad virtual 'password'
  if (user.password) {
    const salt = await bcrypt.genSalt(PASSWORD_ROUNDS);
    user.password_hash = await bcrypt.hash(user.password, salt);
  }
});

// Método de instancia para validar contraseña
User.prototype.validatePassword = async function (plain) {
  if (!this.password_hash) return false;
  return bcrypt.compare(plain, this.password_hash);
};

// Método helper para ocultar campos sensibles al serializar
User.prototype.toSafeJSON = function () {
  const values = { ...this.get() };
  delete values.password_hash;
  delete values.deleted_at;
  return values;
};

// Asociaciones (definir en models/index.js para evitar ciclos)
// ej:
// User.hasOne(models.Staff, { foreignKey: 'user_id', as: 'staffProfile' });
// User.hasOne(models.Guardian, { foreignKey: 'user_id', as: 'guardianProfile' });
// User.belongsTo(models.Role, { foreignKey: 'role_id', as: 'role' });

export default User;
