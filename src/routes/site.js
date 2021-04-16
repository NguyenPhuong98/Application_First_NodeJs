const express = require('express');
const router = express.Router();

const siteController = require('../app/controllers/SiteController');

router.get('/register', siteController.register);
router.post('/store', siteController.storeAccount);
router.get('/login', siteController.login);
router.post('/authentic', siteController.authentic);
router.get('/search', siteController.search);
router.get('/', siteController.home);

module.exports = router;
