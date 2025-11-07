module.exports = (sequelize, DataTypes) => {
  const ChildGuardian = sequelize.define('ChildGuardian', {
    child_id: { type: DataTypes.BIGINT.UNSIGNED, allowNull: false, primaryKey: true },
    guardian_id: { type: DataTypes.BIGINT.UNSIGNED, allowNull: false, primaryKey: true },
    pickup_authorized: { type: DataTypes.BOOLEAN, defaultValue: true }
  }, {
    tableName: 'child_guardians',
    timestamps: false
  });
  return ChildGuardian;
};
