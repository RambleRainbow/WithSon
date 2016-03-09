var express = require('express');
var router = express.Router();
var examvm = require('../viewmodel/examvm.js');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/exam/create', function(req, res, next) {
    examvm.saveExamResult(req.body).
    then(function(id) {
        res.send({examid: id, errorCode:0});
        res.end();
    }).
    catch(function(err) {
        res.send({errorCode:-1, reason: err.message});
        res.end();
    });

});

router.get('/exam', function(req, res, next) {
    examvm.getExamPaperEx({id:req.query.id,count:req.query.count}).
    then(function(exam) {
        res.render('exam', {examPaper: JSON.stringify(exam)});
    }).
    catch(function(err) {
        //throw err;
        res.send(err.message);
        res.end();
    });
    //examvm.getExamPaper(
    //  {
    //    id:req.query.id,
    //    count:req.query.count
    //  },
    //  function(err, examPaper) {
    //    res.render('exam', {examPaper: JSON.stringify(examPaper)});
    //  })
});
module.exports = router;
