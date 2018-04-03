const express = require('express');
const router = express.Router();

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Nice Bank API' });
});

router.get('/docs', function(req, res, next) {
  res.render('docs', { title: 'Docs for Nice Bank API' });
});

router.use('/api/customers', require('./api/customers'));
router.use('/api/accounts', require('./api/accounts'));
router.use('/api/transactions', require('./api/transactions'));

module.exports = router;
