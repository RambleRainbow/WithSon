/**
 * Created by 灵 on 2016/3/13.
 */
var should = require('should');
var eg = require( '../tools/equationGenerator');
var _ = require('underscore')._;

context('equationGenerator', function() {
    context('generateSubstractions', function() {
        it('should generate 0 substraction when minuend is 1', function() {
            var all = eg.generateSubstractions(1);
            all.should.with.lengthOf(0);
        });
        it('should generate 1 substraction when minuend is 2', function() {
            var all = eg.generateSubstractions(2);
            all.should.with.lengthOf(1);
            all[0].should.deepEqual({minuend:2,subtrahend:1,difference:1 });
        });

        it('should generate N-1 substraction when minuend is N', function() {
            for(var i = 1; i < 10; i++) {
                var N = i;
                var all = eg.generateSubstractions(N);
                all.should.with.lengthOf(N-1);
            }
        });
        it('should generate all substraction array when minuend is 5', function() {
            var testData = [
                [5,4,1],
                [5,3,2],
                [5,2,3],
                [5,1,4]
            ];
            var testValue = _.chain(testData)
                .map(function(subs) { return {minuend:subs[0],subtrahend:subs[1],difference:subs[2] };});


            var results = eg.generateSubstractions(5);
            results.should.with.lengthOf(4);

            for(var i = 0; i < testValue.length; i++) {
               results[i].should.deepEqual(testValue[i]);
            }
        });
    });

    context('genrateSubstractionQuestion', function() {
        it('should convert to question object', function() {
            var testData = {minuend:2,subtrahend:1,difference:1};
            var targetData = {
                equation:{minuend:2,subtrahend:1,difference:1},
                text:'2-1=?',
                answer:1,
                input:{type:0},
                label:['math', '-', '<=10', '!%10', '!trade']
            };
            eg.generateSubstractionQuestion(testData).should.deepEqual(targetData);
        });
        it('should contain math label', function() {
            var testData = {minuend: 10, subtrahend:10, difference: 10};
            var testResult = ['math', '-'];

            eg.generateSubstractionQuestion(testData).label.should.containDeep(testResult);
        });
        it('should contain the right range-label', function() {
            var allRangeLabel = ['<=10', '<=20', '<=100', '<=200', '<=1000', '>1000'];
            var testTable = [
                [2, '<=10'],
                [5, '<=10'],
                [10, '<=10'],
                [11, '<=20'],
                [20, '<=20'],
                [21, '<=100'],
                [100, '<=100'],
                [101, '<=200'],
                [200, '<=200'],
                [201, '<=1000'],
                [1000, '<=1000'],
                [1001, '>1000'],
                [10000, '>1000'],
            ];

            _.chain(testTable)
                .map(function(row) {
                    return {equation: {minuend: row[0], subtrahend:0, difference:0}, label:[row[1]]};
                })
                .each(function(equationWithLabel) {
                    var question = eg.generateSubstractionQuestion(equationWithLabel.equation);
                    question.label.should.containDeep(equationWithLabel.label);
                    question.label.should.not.containDeep(_.reject(allRangeLabel, function(label) {
                        return label === equationWithLabel.label[0];
                    }))
                });

        });

        it('should contain the right divisible-by-10-label', function() {
            var allLabel = ['%10', '!%10'];
            var testTable = [
                [0, '%10'],
                [1, '!%10'],
                [10, '%10'],
                [11, '!%10'],
                [100, '%10'],
                [101, '!%10']
            ];

            _.chain(testTable)
                .map(function(row) {
                    return {
                        equation:{minuend:row[0], subtrahend:0, difference:0},
                        label:[row[1]],
                        labelReject: _.reject(allLabel, function(l){return row[1] === l;})
                    }
                })
                .each(function(eqWithLabel) {
                    var q = eg.generateSubstractionQuestion(eqWithLabel.equation);
                    q.label.should.containDeep(eqWithLabel.label);
                    q.label.should.not.containDeep(eqWithLabel.lableReject);
                })
        });

        it('should contain the right trade-label',function() {
            var allLabel = ['trade', '!trade'];
            var testTable = [
                [1,2,'!trade'],
                [11,2,'!trade'],
                [11,22,'!trade'],
                [6,4,'trade'],
                [16,4,'trade'],
                [16,14,'trade'],
                [3,8,'trade'],
                [13,8,'trade'],
                [13,28,'trade']
            ];
            _.chain(testTable)
                .map(function(row) {
                    return {
                        equation:{minuend:row[0] + row[1], subtrahend:row[0], difference:row[1]},
                        label: [row[2]],
                        labelReject: _.reject(allLabel, function(l){return l === row[2];})
                    };
                })
                .each(function(eql) {
                    var q = eg.generateSubstractionQuestion(eql.equation);
                    q.label.should.containDeep(eql.label);
                    q.label.should.not.containDeep(eql.labelReject);
                });
        });
    })
});