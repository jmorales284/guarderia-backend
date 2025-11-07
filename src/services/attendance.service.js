const { Attendance } = require('../models');

module.exports = {
  register: async (payload, recorded_by_user) => {
    try {
      const row = await Attendance.create({ ...payload, recorded_by_user: recorded_by_user || null });
      return row.id;
    } catch (e) {
      // Unique (child_id, att_date, origin, status)
      if (e.name === 'SequelizeUniqueConstraintError') {
        e.status = 409; e.message = 'Asistencia duplicada para ese día/origen/estatus';
      }
      throw e;
    }
  }
};
