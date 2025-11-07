module.exports = (sequelize, DataTypes) => {
  const Attendance = sequelize.define('Attendance', {
    id: { type: DataTypes.BIGINT.UNSIGNED, primaryKey: true, autoIncrement: true },
    child_id: { type: DataTypes.BIGINT.UNSIGNED, allowNull: false },
    att_date: { type: DataTypes.DATEONLY, allowNull: false },
    check_in: { type: DataTypes.TIME },
    check_out: { type: DataTypes.TIME },
    status: { 
      type: DataTypes.ENUM('present','absent','late','left_early'),
      allowNull: false
    },
    origin: { type: DataTypes.ENUM('manual','automatic'), allowNull: false, defaultValue: 'manual' },
    justification: { type: DataTypes.STRING(255) },
    recorded_by_user: { type: DataTypes.BIGINT.UNSIGNED, allowNull: true }
  }, {
    tableName: 'attendance',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false,
    indexes: [
      { unique: true, fields: ['child_id','att_date','origin','status'] },
      { fields: ['child_id','att_date'] }
    ]
  });
  return Attendance;
};
