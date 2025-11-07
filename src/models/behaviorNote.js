module.exports = (sequelize, DataTypes) => {
  const BehaviorNote = sequelize.define('BehaviorNote', {
    id: { type: DataTypes.BIGINT.UNSIGNED, primaryKey: true, autoIncrement: true },
    child_id: { type: DataTypes.BIGINT.UNSIGNED, allowNull: false },
    note_date: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    severity: { 
      type: DataTypes.ENUM('info','positive','warning','critical'),
      defaultValue: 'info'
    },
    note: { type: DataTypes.TEXT, allowNull: false },
    created_by_user: { type: DataTypes.BIGINT.UNSIGNED, allowNull: false }
  }, {
    tableName: 'behavior_notes',
    timestamps: false,
    indexes: [{ fields: ['child_id','note_date'] }]
  });
  return BehaviorNote;
};
