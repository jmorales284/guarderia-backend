const { BehaviorNote } = require('../models');

module.exports = {
  listByChild: async (child_id) => {
    return BehaviorNote.findAll({ where: { child_id }, order: [['note_date','DESC']] });
  },
  create: async (data) => {
    const row = await BehaviorNote.create(data);
    return row.id;
  }
};
