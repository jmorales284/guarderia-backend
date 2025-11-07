module.exports = (sequelize, DataTypes) => {
  const Classroom = sequelize.define('Classroom', {
    id: { type: DataTypes.BIGINT.UNSIGNED, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING(80), allowNull: false, unique: true },
    capacity: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    age_min_months: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    age_max_months: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    active: { type: DataTypes.BOOLEAN, defaultValue: true }
  }, {
    tableName: 'classrooms',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });
  return Classroom;
};
