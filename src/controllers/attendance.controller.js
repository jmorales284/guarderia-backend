const service = require('../services/attendance.service');

module.exports = {
  register: async (req, res) => {
    const userId = req.user?.sub; // si ya tienes auth middleware
    const id = await service.register(req.body, userId);
    res.status(201).json({ ok: true, id });
  }
};
