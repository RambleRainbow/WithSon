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
            }).then(function (questions) {
                if (questions.length == 0) {
                    reject(new Error("question pool is empty"));
                }
                else {
                    var maxCount = Math.max(1, Math.min(1000,examParam.count));
                    var examData = {
                        name: questions[0],
                        questionPool: []
                    }
                    while(maxCount != 0 && questions[1].length != 0) {
                        var idx = Math.floor(Math.random() * questions[1].length);
                        examData.questionPool.push(questions[1][idx]);
                        questions[1].splice(idx,1);
                        maxCount--;
                    }

                    if(examData.questionPool.length === 0) {
                        reject(new Error('question pool is empty'));
                    }
                    else {
                        resolve(examData);
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

            var examResults = db.collection('examResults');
            examResults.insert(examResult).
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

            var examResults = db.collection('examResults');
            examResults.find({_id: ObjectID(examId)}).toArray().
            then(function(examResults) {
                if(examResults.length !== 1) {
                    reject(new Error('error exmaid:' + examId));
                    return;
                }

                var errStatistic = _.chain(examResults[0].subjects)
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

                var timespanStatistic = _.chain(examResults[0].subjects)
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
                            timeSpan: (_.chain(answerSpans)
                                .reduce(function (memo, t) {
                                    return memo + t.timeSpan;
                                }, 0)
                                .value() / len / 1000).toString() + '秒'
                        }
                    })
                    .toArray()
                    .value();

                resolve({
                    name: examResults[0].paper.name,
                    startTime: new Date(examResults[0].paper.startTime).toLocaleDateString() + " " +
                               new Date(examResults[0].paper.startTime).toLocaleTimeString(),
                    totalTime: (function() {
                        var time = Math.floor((new Date(examResults[0].paper.endTime) - new Date(examResults[0].paper.startTime))/1000);
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