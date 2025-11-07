module.exports = (sequelize, DataTypes) => {
  const Staff = sequelize.define('Staff', {
    id: { type: DataTypes.BIGINT.UNSIGNED, primaryKey: true, autoIncrement: true },
    user_id: { type: DataTypes.BIGINT.UNSIGNED, allowNull: false, unique: true },
    document: { type: DataTypes.STRING(40), allowNull: false, unique: true },
    specific_role: { 
      type: DataTypes.ENUM('educator','assistant','admin','accounting'),
      allowNull: false
    },
    shift_notes: { type: DataTypes.STRING(255) },
    active: { type: DataTypes.BOOLEAN, defaultValue: true }
  }, {
    tableName: 'staff',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });
  return Staff;
};
