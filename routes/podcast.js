var express = require('express');
var router = express.Router();

// Some sample function definitions for using the Listen Notes API to get podcast data
router.post('/search', function(req, res, next) {
  res.send('This may return a podcast name, description, photo, podcast ID, etc.');
});

router.post('/recommendations', function(req, res, next) {
  res.send('Maybe we can have a feature to recommend podcasts based on the podcasts that the user has positive reviews on.');
});

module.exports = router;
