const { Router } = require('express');
const ctrl = require('../controllers/staff.controller');
const { createStaff, updateStaff } = require('../validators/staff.validator');
const validate = require('../middlewares/validation.middleware');

const router = Router();
router.get('/', /*auth, requireRole('admin'),*/ ctrl.list);
router.post('/', validate(createStaff), /*auth, requireRole('admin'),*/ ctrl.create);
router.put('/:id', validate(updateStaff), /*auth, requireRole('admin'),*/ ctrl.update);
router.patch('/:id/deactivate', /*auth, requireRole('admin'),*/ ctrl.deactivate);

module.exports = router;
