const { Router } = require('express');
const ctrl = require('../controllers/guardian.controller');

const router = Router();
router.get('/', /*auth,*/ ctrl.list);
router.post('/', /*auth,*/ ctrl.create);
router.post('/link', /*auth,*/ ctrl.link);     // { child_id, guardian_id, pickup_authorized }
router.post('/unlink', /*auth,*/ ctrl.unlink); // { child_id, guardian_id }

module.exports = router;
