var express = require('express');
var router = express.Router();
var examvm = require('../viewmodel/examvm.js');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/exam', function(req, res, next) {
  examvm.getExamPaper(
      {
        id:req.query.id,
        count:req.query.count
      },
      function(err, examPaper) {
        res.render('exam', {examPaper: JSON.stringify(examPaper)});
      })
});
module.exports = router;
