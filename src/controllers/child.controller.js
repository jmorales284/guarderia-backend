const service = require('../services/child.service');

module.exports = {
  list: async (req, res) => {
    const data = await service.list(req.query);
    res.json({ ok: true, data });
  },
  create: async (req, res) => {
    const id = await service.create(req.body);
    res.status(201).json({ ok: true, id });
  },
  update: async (req, res) => {
    await service.update(req.params.id, req.body);
    res.json({ ok: true });
  }
};
