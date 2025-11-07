module.exports = (sequelize, DataTypes) => {
  const Guardian = sequelize.define('Guardian', {
    id: { type: DataTypes.BIGINT.UNSIGNED, primaryKey: true, autoIncrement: true },
    user_id: { type: DataTypes.BIGINT.UNSIGNED, unique: true, allowNull: true },
    full_name: { type: DataTypes.STRING(120), allowNull: false },
    document: { type: DataTypes.STRING(40), allowNull: false, unique: true },
    relationship: { type: DataTypes.STRING(40) },
    family_id: { type: DataTypes.BIGINT.UNSIGNED, allowNull: true }
  }, {
    tableName: 'guardians',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false
  });
  return Guardian;
};
