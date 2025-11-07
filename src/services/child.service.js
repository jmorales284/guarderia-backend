const { Child, Classroom } = require('../models');

module.exports = {
  list: async ({ limit = 20, page = 1 }) => {
    const offset = (page - 1) * limit;
    const { rows, count } = await Child.findAndCountAll({
      include: [{ model: Classroom, attributes: ['id','name'] }],
      limit: Number(limit), offset: Number(offset), order: [['id','DESC']]
    });
    return { items: rows, total: count, page: Number(page), limit: Number(limit) };
  },

  create: async (data) => {
    const row = await Child.create(data);
    return row.id;
  },

  update: async (id, data) => {
    const row = await Child.findByPk(id);
    if (!row) { const e = new Error('Niño no encontrado'); e.status = 404; throw e; }
    await row.update(data);
    return true;
  }
};
