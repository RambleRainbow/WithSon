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

function getErrStatistic(subjects) {
    var result = _.chain(subjects)
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
    return result;
}

function getTimespanStatistic(subjects) {
    var result = _.chain(subjects)
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

    return result;
}

function getTimespanChart(exam) {
    return {
        title: {
            text: '本次测试',
            x: -20 //center
        },
        subtitle: {
            text: exam.paper.startTime.toLocaleString(),
            x: -20
        },
        xAxis: {
            categories: _.map(exam.subjects, function(s) { var t =  s.question.text;t = t.substring(0, t.length - 2); return t;})
        },
        yAxis: {
            title: {
                text: '计时(秒)'
            },
            labels: {
                formatter: function() {
                    return this.value +'\''
                }
            },
            plotLines: [{
                value: 0,
                width: 1,
                color: '#808080'
            }]
        },
        tooltip: {
            valueSuffix: '秒'
        },
        legend: {
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'middle',
            borderWidth: 0
        },
        series: [{
            name: '耗时',
            data: _.map(exam.subjects, function(s) {
                var coust = (new Date(s.endTime) - new Date(s.startTime))/1000;
                if(s.isRight) {
                    return coust;
                } else {
                    return {
                        y: coust,
                        marker:{
                            symbol: 'diamond',
                            fillColor: '#FF0000'
                        }
                    }
                }
            })
        }]
    };
}

function getPerquestionChart(exam) {
    var calc = _.chain(exam.subjects)
        .map(function(s){ return {
            question: s.question.text,
            timeSpan: (new Date(s.endTime) - new Date(s.startTime))/1000
        }})
        .groupBy(function(s){ return s.question;})
        .mapObject(function(spans, question) {
            return {
                question: question,
                timeSpans: spans
            }
        })
        .toArray()
        .value();

    var i = 1;
    return {
        chart: {
            type: 'column'
        },
        title: {
            text: 'Stacked column chart'
        },
        xAxis: {
            categories: _.map(calc, function(v){ return v.question;})
        },
        yAxis: {
            min: 0,
            title: {
                text: 'Total fruit consumption'
            },
            stackLabels: {
                enabled: true,
                style: {
                    fontWeight: 'bold',
                    //color: (Highcharts.theme && Highcharts.theme.textColor) || 'gray'
                }
            }
        },
        legend: {
            align: 'right',
            x: -70,
            verticalAlign: 'top',
            y: 20,
            floating: true,
            //backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColorSolid) || 'white',
            borderColor: '#CCC',
            borderWidth: 1,
            shadow: false
        },
        tooltip: {
            formatter: function() {
                return '<b>'+ this.x +'</b><br/>'+
                    this.series.name +': '+ this.y +'<br/>'+
                    'Total: '+ this.point.stackTotal;
            }
        },
        plotOptions: {
            column: {
                stacking: 'normal',
                dataLabels: {
                    //enabled: true,
                    //color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'white'
                }
            }
        },
        series: [
            {
                name: '9',
                data: _.map(calc, function (v) {
                    return (v.timeSpans.length > 8) ? v.timeSpans[8].timeSpan : 0;
                })
            },
            {
                name: '8',
                data: _.map(calc, function (v) {
                    return (v.timeSpans.length > 7) ? v.timeSpans[7].timeSpan : 0;
                })
            },
            {
                name: '7',
                data: _.map(calc, function (v) {
                    return (v.timeSpans.length > 6) ? v.timeSpans[6].timeSpan : 0;
                })
            },
            {
                name: '6',
                data: _.map(calc, function (v) {
                    return (v.timeSpans.length > 5) ? v.timeSpans[5].timeSpan : 0;
                })
            },
            {
                name: '5',
                data: _.map(calc, function (v) {
                    return (v.timeSpans.length > 4) ? v.timeSpans[4].timeSpan : 0;
                })
            },
            {
                name: '4',
                data: _.map(calc, function (v) {
                    return (v.timeSpans.length > 3) ? v.timeSpans[3].timeSpan : 0;
                })
            },
            {
                name: '3',
                data: _.map(calc, function (v) {
                    return (v.timeSpans.length > 2) ? v.timeSpans[2].timeSpan : 0;
                })
            },
            {
                name: '2',
                data: _.map(calc, function (v) {
                    return (v.timeSpans.length > 1) ? v.timeSpans[1].timeSpan : 0;
                })
            },
            {
                name: '1',
                data: _.map(calc, function (v) {
                    return (v.timeSpans.length > 0) ? v.timeSpans[0].timeSpan : 0;
                })
            }
        ]
    };
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

                var errStatistic = getErrStatistic(exams[0].subjects);
                var timespanStatistic = getTimespanStatistic(exams[0].subjects);

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
                    timeSpan: timespanStatistic,
                    chartTimespan: getTimespanChart(exams[0]),
                    chartPerquestion:getPerquestionChart(exams[0])
                });
            }).
            catch(function(err) {
                reject(err);
            })
        })
    });
};

module.exports = {
    getExamPaperEx: getExamPaperEx,
    saveExamResult: saveExamResult,
    getExamStatistic: getExamStatistic
}