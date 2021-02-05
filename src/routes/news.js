const express = require('express');
const router = express.Router();

const newsController = require('../app/controllers/NewsController');

router.use('/:slug', newsController.show);
            router.use('/', newsController.news);

module.exports = router;
