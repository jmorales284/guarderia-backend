module.exports = (sequelize, DataTypes) => {
  const Child = sequelize.define('Child', {
    id: { type: DataTypes.BIGINT.UNSIGNED, primaryKey: true, autoIncrement: true },
    full_name: { type: DataTypes.STRING(120), allowNull: false },
    document: { type: DataTypes.STRING(40), unique: true },
    birth_date: { type: DataTypes.DATEONLY, allowNull: false },
    classroom_id: { type: DataTypes.BIGINT.UNSIGNED, allowNull: true },
    family_id: { type: DataTypes.BIGINT.UNSIGNED, allowNull: true },
    medical_info: { type: DataTypes.TEXT },
    active: { type: DataTypes.BOOLEAN, defaultValue: true }
  }, {
    tableName: 'children',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false
  });
  return Child;
};
