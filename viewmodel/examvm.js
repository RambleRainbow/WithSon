var config = require('../config');
var mongoClient = require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectID;

var getExamPaperEx = function(examParam) {
    return new Promise(function(resolve, reject){
        mongoClient.connect(config.dburl, function (err, db) {
            var exams = db.collection('exams');
            exams.find({_id: parseInt(examParam.id)}).toArray().then(function (exams) {
                if (exams.length == 0) {
                    reject(new Error('no such exam'));
                }
                else {
                    var query = JSON.parse(exams[0].questionQuery);
                    var questions = db.collection('questions');
                    return Promise.all([exams[0].name, questions.find(query,{equation:0,label:0,_id:0}).toArray()]);
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

module.exports = {
    getExamPaperEx: getExamPaperEx,
    saveExamResult: saveExamResult
}