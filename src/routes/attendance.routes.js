const { Router } = require('express');
const ctrl = require('../controllers/attendance.controller');
const { registerAttendance } = require('../validators/attendance.validator');
const validate = require('../middlewares/validation.middleware');

const router = Router();
router.post('/', validate(registerAttendance), /*auth, requireRole('admin','educator'),*/ ctrl.register);

module.exports = router;
