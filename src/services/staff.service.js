const { Staff } = require('../models');

module.exports = {
  list: async ({ limit = 20, page = 1 }) => {
    const offset = (page - 1) * limit;
    const { rows, count } = await Staff.findAndCountAll({
      limit: Number(limit), offset: Number(offset), order: [['id','DESC']]
    });
    return { items: rows, total: count, page: Number(page), limit: Number(limit) };
  },

  create: async (payload) => {
    const row = await Staff.create(payload);
    return row.id;
  },

  update: async (id, data) => {
    const row = await Staff.findByPk(id);
    if (!row) { const e = new Error('Staff no encontrado'); e.status = 404; throw e; }
    await row.update(data);
    return true;
  },

  deactivate: async (id) => {
    const row = await Staff.findByPk(id);
    if (!row) { const e = new Error('Staff no encontrado'); e.status = 404; throw e; }
    await row.update({ active: false });
    return true;
  }
};
