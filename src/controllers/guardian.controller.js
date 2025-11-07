const service = require('../services/guardian.service');

module.exports = {
  list: async (req, res) => {
    const data = await service.list();
    res.json({ ok: true, data });
  },
  create: async (req, res) => {
    const id = await service.create(req.body);
    res.status(201).json({ ok: true, id });
  },
  link: async (req, res) => {
    await service.linkChild(req.body);
    res.json({ ok: true });
  },
  unlink: async (req, res) => {
    await service.unlinkChild(req.body);
    res.json({ ok: true });
  }
};
