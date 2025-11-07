const sequelize = require('../config/database');
const { DataTypes } = require('sequelize');

// MODELOS DEV 1
const Staff          = require('./Staff')(sequelize, DataTypes);
const Classroom      = require('./Classroom')(sequelize, DataTypes);
const ClassroomStaff = require('./ClassroomStaff')(sequelize, DataTypes);
const Child          = require('./Child')(sequelize, DataTypes);
const Guardian       = require('./Guardian')(sequelize, DataTypes);
const ChildGuardian  = require('./ChildGuardian')(sequelize, DataTypes);
const Attendance     = require('./Attendance')(sequelize, DataTypes);
const BehaviorNote   = require('./BehaviorNote')(sequelize, DataTypes);

// === ASOCIACIONES ===

// Classroom <-> Staff (N:M)
Classroom.belongsToMany(Staff, {
  through: ClassroomStaff,
  foreignKey: 'classroom_id',
  otherKey: 'staff_id'
});
Staff.belongsToMany(Classroom, {
  through: ClassroomStaff,
  foreignKey: 'staff_id',
  otherKey: 'classroom_id'
});
ClassroomStaff.belongsTo(Classroom, { foreignKey: 'classroom_id' });
ClassroomStaff.belongsTo(Staff, { foreignKey: 'staff_id' });

// Child -> Classroom (N:1)
Child.belongsTo(Classroom, { foreignKey: 'classroom_id' });
Classroom.hasMany(Child, { foreignKey: 'classroom_id' });

// Guardian -> (optional user) omitimos por ahora

// Family opcional (no Dev1), así que lo dejamos nullable en Child

// Child <-> Guardian (N:M)
Child.belongsToMany(Guardian, {
  through: ChildGuardian,
  foreignKey: 'child_id',
  otherKey: 'guardian_id'
});
Guardian.belongsToMany(Child, {
  through: ChildGuardian,
  foreignKey: 'guardian_id',
  otherKey: 'child_id'
});

// Attendance -> Child (N:1)
Attendance.belongsTo(Child, { foreignKey: 'child_id' });
Child.hasMany(Attendance, { foreignKey: 'child_id' });

// BehaviorNote -> Child (N:1)
BehaviorNote.belongsTo(Child, { foreignKey: 'child_id' });
Child.hasMany(BehaviorNote, { foreignKey: 'child_id' });

module.exports = {
  sequelize,
  Staff,
  Classroom,
  ClassroomStaff,
  Child,
  Guardian,
  ChildGuardian,
  Attendance,
  BehaviorNote
};
