const { Classroom } = require('../models');

module.exports = {
  list: async () => {
    return Classroom.findAll({ order: [['id','DESC']] });
  },
  create: async (data) => {
    const row = await Classroom.create(data);
    return row.id;
  },
  update: async (id, data) => {
    const row = await Classroom.findByPk(id);
    if (!row) { const e = new Error('Aula no encontrada'); e.status = 404; throw e; }
    await row.update(data);
    return true;
  },
  deactivate: async (id) => {
    const row = await Classroom.findByPk(id);
    if (!row) { const e = new Error('Aula no encontrada'); e.status = 404; throw e; }
    await row.update({ active: false });
    return true;
  }
};
