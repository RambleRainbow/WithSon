/**
 * Created by 灵 on 2016/3/26.
 */
var should = require('should');
var SubjectStatisticsVM = require('../viewmodel/subjectStatisticsvm');

describe('subject statistics', function() {
    describe('subjects', function() {
        it('should map to statistics structs', function() {
            var testData = [{
                question: {
                    text: "1+1=?",
                    answer: "2",
                },
                answer:2,
                isRight: true,
                timeSpan: 3000
            }];

            var testResult = [{
                question: '1+1=?',
                rightCount:1,
                wrongCount:0,
                blow6Sec: 1,
                blow10Sec: 0,
                over10Sec: 0
            }];

            var ss = new SubjectStatisticsVM();
            var result = ss.calc(testData);

            result.should.deepEqual(testResult);
        });
    });
});