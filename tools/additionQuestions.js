/**
 * Created by 灵 on 2016/3/6.
 */
var _ = require('underscore')._;
function makeAddendPair(upperRange, firstAddend) {
    var all = [];
    for (var i = 1; i <= upperRange; i++) {
        all.push([firstAddend, i]);
    }
    return all;
}

function makeQuestion(addends) {
    return {
        equation: {
            addends: [].concat(addends),
            sum: addends[0] + addends[1]
        },
        text: addends[0].toString() + '+' + addends[1].toString() + '=?',
        answer: addends[0] + addends[1],
        input: {type: 0}
    }
}

function getRangeLabel(question) {
    //range label
    if (question.answer <= 10) {
        return ('<=10');
    }
    else if (question.answer <= 20) {
        return ('<=20');
    }
    else if (question.answer <= 100) {
        return ('<=100');
    }
    else if (question.answer <= 200) {
        return ('<=200');
    }
    else if (question.answer <= 1000) {
        return ('<=1000');
    }
}

function getModTenLabel(question) {
    //end of zero
    if (question.answer % 10 == 0) {
        return ('%10');
    }
    else {
        return '!%10';
    }
}

function getTradeLabel(question) {
    var v = _.chain(question.equation.addends)
        .map(function (addend) {
            return addend % 10;
        })
        .reduce(function (memo, addend) {
            return memo + addend;
        }, 0)
        .value();
    if (v >= 10) {
        return ('trade');
    }
    else {
        return '!trade';
    }
}

function markQuestionLabel(question) {
    question.label = ['+', 'math'];

    question.label.push(getRangeLabel(question));
    question.label.push(getModTenLabel(question));
    question.label.push(getTradeLabel(question));
    return question;
}

function generateAddQuestions(upperRange) {
    var makeAddendPairWithRange = _.partial(makeAddendPair, upperRange);
    return _.chain(_.range(1,upperRange+1,1))
        .map(makeAddendPairWithRange)
        .reduce(function(memo, t){return memo.concat(t);}, [])
        .map(makeQuestion)
        .map(markQuestionLabel)
        .value();
}

module.exports = {
    generateAddQuestions: generateAddQuestions
}