var config = require('../config');
var mongoClient = require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectID;
var _ = require('underscore')._;

var getExamPaperEx = function(examParam) {
    return new Promise(function(resolve, reject){
        mongoClient.connect(config.dburl, function (err, db) {
            var examRules = db.collection('examRules');
            examRules.find({_id: parseInt(examParam.id)}).toArray().then(function (rules) {
                if (rules.length == 0) {
                    reject(new Error('no such exam'));
                }
                else {
                    var query = JSON.parse(rules[0].questionQuery);
                    var questions = db.collection('questions');
                    return Promise.all([rules[0].name, questions.find(query,{equation:0,label:0,_id:0}).toArray()]);
                }
            }).then(function (nameAndQuestions) {
                if (nameAndQuestions[1].length == 0) {
                    reject(new Error("question pool is empty"));
                }
                else {
                    var maxCount = Math.max(1, Math.min(1000,examParam.count));
                    var examPaper = {
                        name: nameAndQuestions[0],
                        correctNumber:examParam.correctNumber,
                        timeLimit:examParam.timeLimit,
                        memorySpan:examParam.memorySpan,
                        questionPool: []
                    }

                    examPaper.questionPool = _.shuffle(nameAndQuestions[1]).slice(0, maxCount);
                    //while(maxCount != 0 && nameAndQuestions[1].length != 0) {
                    //    var idx = Math.floor(Math.random() * nameAndQuestions[1].length);
                    //    examPaper.questionPool.push(nameAndQuestions[1][idx]);
                    //    nameAndQuestions[1].splice(idx,1);
                    //    maxCount--;
                    //}

                    if(examPaper.questionPool.length === 0) {
                        reject(new Error('question pool is empty'));
                    }
                    else {
                        resolve(examPaper);
                    }
                }
            }).catch(function (err) {
                console.log(err);
                db.close();
                reject(err);
            });
        });
    });
};

var saveExamResult = function(examResult) {
    return new Promise(function(resolve, reject) {
        var objectId = new ObjectID();
        examResult._id = objectId;

        mongoClient.connect(config.dburl, function(err, db) {
            if(err) {
                reject(err);
            }

            var exams = db.collection('exams');
            exams.insert(examResult).
            then(function() {
                resolve(objectId.toHexString());
                db.close();
            }).
            catch(function(err) {
                reject(err);
                db.close();
            })
        });
    });
}

var getExamStatistic = function(examId) {
    return new Promise(function(resolve, reject) {
        mongoClient.connect(config.dburl, function(err, db) {
            if(err) {
                reject(err);
                return;
            }

            var exams = db.collection('exams');
            exams.find({_id: ObjectID(examId)}).toArray().
            then(function(exams) {
                if(exams.length !== 1) {
                    reject(new Error('error exmaid:' + examId));
                    return;
                }

                var errStatistic = _.chain(exams[0].subjects)
                    .map(function(subject) {
                        var i = 1;
                        return {
                            question: subject.question.text,
                            rightAnswer: subject.question.answer,
                            answer: subject.answer,
                            isRight: subject.isRight
                        };
                    })
                    .reject(function(subject){return subject.isRight;})
                    .value();

                var timespanStatistic = _.chain(exams[0].subjects)
                    .map(function(subject) {
                        return {
                            question: subject.question.text,
                            timeSpan: new Date(subject.endTime) - new Date(subject.startTime)
                        }
                    })
                    .groupBy(function(subject) {
                        return subject.question;
                    })
                    .mapObject(function(answerSpans, question) {
                        var len = answerSpans.length;
                        return {
                            question: question,
                            times: len,
                            timeSpan: (Math.floor(_.chain(answerSpans)
                                .reduce(function (memo, t) {
                                    return memo + t.timeSpan;
                                }, 0)
                                .value() / len / 10))/100
                        }
                    })
                    .toArray()
                    .sortBy(function(timeSpan){return -1 * timeSpan.timeSpan;})
                    .map(function(timeSpan){timeSpan.timeSpan = timeSpan.timeSpan.toString() + '秒';return timeSpan;})
                    .value();

                resolve({
                    name: exams[0].paper.name,
                    startTime: new Date(exams[0].paper.startTime).toLocaleDateString() + " " +
                               new Date(exams[0].paper.startTime).toLocaleTimeString(),
                    totalTime: (function() {
                        var time = Math.floor((new Date(exams[0].paper.endTime) - new Date(exams[0].paper.startTime))/1000);
                        var min = Math.floor(time/60);
                        var sec = time % 60;
                        return min.toString() + "分" + sec.toString() + "秒";
                    })(),
                    err: errStatistic,
                    timeSpan: timespanStatistic
                });
            }).
            catch(function(err) {
                throw err;
            })
        })
    });
};

module.exports = {
    getExamPaperEx: getExamPaperEx,
    saveExamResult: saveExamResult,
    getExamStatistic: getExamStatistic
}