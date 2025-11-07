module.exports = (sequelize, DataTypes) => {
  const ClassroomStaff = sequelize.define('ClassroomStaff', {
    classroom_id: { type: DataTypes.BIGINT.UNSIGNED, allowNull: false, primaryKey: true },
    staff_id:     { type: DataTypes.BIGINT.UNSIGNED, allowNull: false, primaryKey: true },
    role_in_class:{ type: DataTypes.ENUM('lead','support'), allowNull: false },
    assigned_at:  { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
  }, {
    tableName: 'classroom_staff',
    timestamps: false
  });
  return ClassroomStaff;
};
