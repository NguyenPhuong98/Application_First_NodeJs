const express = require('express');
const router = express.Router();

const coursesController = require('../app/controllers/CoursesController');

router.get('/create', coursesController.create);
router.get('/store', coursesController.store);
router.get('/:slug', coursesController.show);
router.get('/', coursesController.show);

module.exports = router;