const { Router } = require('express');
const ctrl = require('../controllers/child.controller');
const { createChild, updateChild } = require('../validators/child.validator');
const validate = require('../middlewares/validation.middleware');

const router = Router();
router.get('/', /*auth, requireRole('admin','educator'),*/ ctrl.list);
router.post('/', validate(createChild), /*auth,*/ ctrl.create);
router.put('/:id', validate(updateChild), /*auth,*/ ctrl.update);

module.exports = router;
