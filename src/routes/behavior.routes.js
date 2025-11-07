const { Router } = require('express');
const ctrl = require('../controllers/behavior.controller');

const router = Router();
router.get('/child/:child_id', /*auth,*/ ctrl.listByChild);
router.post('/', /*auth, requireRole('admin','educator'),*/ ctrl.create);

module.exports = router;
