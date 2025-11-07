const service = require('../services/classroom.service');

module.exports = {
  list: async (req, res) => {
    const data = await service.list();
    res.json({ ok: true, data });
  },
  create: async (req, res) => {
    const id = await service.create(req.body);
    res.status(201).json({ ok: true, id });
  },
  update: async (req, res) => {
    await service.update(req.params.id, req.body);
    res.json({ ok: true });
  },
  deactivate: async (req, res) => {
    await service.deactivate(req.params.id);
    res.json({ ok: true });
  }
};
