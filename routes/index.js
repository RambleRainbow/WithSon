var express = require('express');
var router = express.Router();
var examvm = require('../viewmodel/examvm.js');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', {title: 'Growing With Son'});
});

router.get('/index.html', function(req, res, next) {
    res.redirect('/');
});

router.get('/english.html', function(req, res, next) {
    res.render('english', {title: 'Growing With Son - 英语'});
});

router.get('/math.html', function(req, res, next) {
    res.render('math', {title:'Growing With Son - 数学'});
});

router.get('/exam/statistics', function(req, res, next) {
    examvm.getExamStatistic(req.query.id).
    then(function(result) {
        res.render('examStatistics', {title: '测试结果',statistic: result});
    }).
    catch(function(err) {
        res.send(err);
        res.end();
    })
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
    examvm.getExamPaperEx({
        id:req.query.id,
        count:req.query.count,
        correctNumber:(req.query.correctNumber),
        timeLimit:(req.query.timeLimit),
        memorySpan:(req.query.memorySpan)
    }).
    then(function(exam) {
        res.render('exam', {examPaper: JSON.stringify(exam)});
    }).
    catch(function(err) {
        res.send(err.message);
        res.end();
    });
});
module.exports = router;
