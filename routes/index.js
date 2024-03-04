var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  // Example response
  res.json([
    { id: 4, name: 'John Doe' },
    { id: 8, name: 'Jane Doe' }
  ]);
});

module.exports = router;
