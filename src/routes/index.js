const { Router } = require('express');

const staff = require('./staff.routes');
const classroom = require('./classroom.routes');
const child = require('./child.routes');
const guardian = require('./guardian.routes');
const attendance = require('./attendance.routes');
const behavior = require('./behavior.routes');

const router = Router();

router.use('/staff', staff);
router.use('/classrooms', classroom);
router.use('/children', child);
router.use('/guardians', guardian);
router.use('/attendance', attendance);
router.use('/behavior', behavior);

module.exports = router;
