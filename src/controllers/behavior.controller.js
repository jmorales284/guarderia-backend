const service = require('../services/behavior.service');

module.exports = {
  listByChild: async (req, res) => {
    const { child_id } = req.params;
    const data = await service.listByChild(child_id);
    res.json({ ok: true, data });
  },
  create: async (req, res) => {
    const id = await service.create(req.body);
    res.status(201).json({ ok: true, id });
  }
};
