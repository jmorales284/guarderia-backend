const { Router } = require('express');
const ctrl = require('../controllers/classroom.controller');

const router = Router();
router.get('/', /*auth,*/ ctrl.list);
router.post('/', /*auth, requireRole('admin'),*/ ctrl.create);
router.put('/:id', /*auth, requireRole('admin'),*/ ctrl.update);
router.patch('/:id/deactivate', /*auth, requireRole('admin'),*/ ctrl.deactivate);

module.exports = router;
