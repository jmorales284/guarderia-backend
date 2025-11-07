const { Guardian, Child, ChildGuardian } = require('../models');

module.exports = {
  list: async () => {
    return Guardian.findAll({ order: [['id','DESC']] });
  },
  create: async (data) => {
    const row = await Guardian.create(data);
    return row.id;
  },
  linkChild: async ({ child_id, guardian_id, pickup_authorized = true }) => {
    await ChildGuardian.create({ child_id, guardian_id, pickup_authorized });
    return true;
  },
  unlinkChild: async ({ child_id, guardian_id }) => {
    const row = await ChildGuardian.findOne({ where: { child_id, guardian_id } });
    if (!row) { const e = new Error('Relación no encontrada'); e.status = 404; throw e; }
    await row.destroy();
    return true;
  }
};
