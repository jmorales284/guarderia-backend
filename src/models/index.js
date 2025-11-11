// src/models/index.js
const sequelize = require('../config/database');
const { DataTypes } = require('sequelize');

// MODELOS DEV 1
const Staff          = require('./staff')(sequelize, DataTypes);
const Classroom      = require('./classroom')(sequelize, DataTypes);
const ClassroomStaff = require('./classroomStaff')(sequelize, DataTypes);
const Child          = require('./child')(sequelize, DataTypes);
const Guardian       = require('./guardian')(sequelize, DataTypes);
const ChildGuardian  = require('./childGuardian')(sequelize, DataTypes);
const Attendance     = require('./attendance')(sequelize, DataTypes);
const BehaviorNote   = require('./behaviorNote')(sequelize, DataTypes);

// MODELOS DEV 2 (nuevos)
const Invoice        = require('./invoice')(sequelize, DataTypes);
const Meeting        = require('./meeting')(sequelize, DataTypes);
const Menu           = require('./menu')(sequelize, DataTypes);
const MenuItem       = require('./menuItem')(sequelize, DataTypes);
const Activity       = require('./activity')(sequelize, DataTypes);
const AuditLog       = require('./auditLog')(sequelize, DataTypes);
const ChatBot        = require('./chatBot')(sequelize, DataTypes);
const Notifications  = require('./notifications')(sequelize, DataTypes);
const Payment        = require('./payment')(sequelize, DataTypes);
const Permission     = require('./permission')(sequelize, DataTypes);
const Role           = require('./role')(sequelize, DataTypes);
const User           = require('./user')(sequelize, DataTypes);
const WeeklyPlan     = require('./weeklyPlan')(sequelize, DataTypes);

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

// === NUEVAS RELACIONES ===

// WeeklyPlan -> Classroom (N:1)
WeeklyPlan.belongsTo(Classroom, { foreignKey: 'classroom_id', as: 'classroom' });
Classroom.hasMany(WeeklyPlan, { foreignKey: 'classroom_id', as: 'weekly_plans' });

// WeeklyPlan -> User (creador)
WeeklyPlan.belongsTo(User, { foreignKey: 'created_by', as: 'creator' });
User.hasMany(WeeklyPlan, { foreignKey: 'created_by', as: 'weekly_plans_created' });

// Activity -> WeeklyPlan (N:1)
Activity.belongsTo(WeeklyPlan, { foreignKey: 'weekly_plan_id', as: 'weekly_plan' });
WeeklyPlan.hasMany(Activity, { foreignKey: 'weekly_plan_id', as: 'activities' });

// User -> Role (N:1)
User.belongsTo(Role, { foreignKey: 'role_id', as: 'role' });
Role.hasMany(User, { foreignKey: 'role_id', as: 'users' });

// Role <-> Permission (N:M)
Role.belongsToMany(Permission, {
  through: 'role_permissions',
  foreignKey: 'role_id',
  otherKey: 'permission_id',
  as: 'permissions'
});
Permission.belongsToMany(Role, {
  through: 'role_permissions',
  foreignKey: 'permission_id',
  otherKey: 'role_id',
  as: 'roles'
});

// Payment -> Invoice (N:1)
Payment.belongsTo(Invoice, { foreignKey: 'invoice_id', as: 'invoice' });
Invoice.hasMany(Payment, { foreignKey: 'invoice_id', as: 'payments' });

// AuditLog -> User (N:1)
AuditLog.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
User.hasMany(AuditLog, { foreignKey: 'user_id', as: 'logs' });

// Notifications -> User (N:1)
Notifications.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
User.hasMany(Notifications, { foreignKey: 'user_id', as: 'notifications' });

// Meeting -> Classroom (N:1)
Meeting.belongsTo(Classroom, { foreignKey: 'classroom_id', as: 'classroom' });
Classroom.hasMany(Meeting, { foreignKey: 'classroom_id', as: 'meetings' });

// === EXPORTAR MODELOS ===
module.exports = {
  sequelize,
  // DEV1
  Staff,
  Classroom,
  ClassroomStaff,
  Child,
  Guardian,
  ChildGuardian,
  Attendance,
  BehaviorNote,
  // DEV2
  Invoice,
  Meeting,
  Menu,
  MenuItem,
  Activity,
  AuditLog,
  ChatBot,
  Notifications,
  Payment,
  Permission,
  Role,
  User,
  WeeklyPlan
};
