/**
 * Created by 灵 on 2016/3/15.
 */
var should = require('should');
var _ = require('underscore')._;

context('examRule', function() {
    context('initRule', function() {
        var testTimes = 2;
        var testLimit = 6;
        var rule = new ExamRule(testTimes, testLimit);

        rule.times.should.equal(2);
        rule.timeLimit.should.equal(6);
    })
})