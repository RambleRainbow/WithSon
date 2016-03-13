/**
 * Created by 灵 on 2016/3/13.
 */
var _ = require('underscore')._;

function getRangeLabel(num) {
    if(num <= 10) {
        return '<=10';
    }
    else if(num <= 20) {
        return '<=20';
    }
    else if(num <= 100) {
        return '<=100';
    }
    else if(num <= 200) {
        return '<=200';
    }
    else if(num <= 1000) {
        return '<=1000';
    }
    else {
        return '>1000';
    }
};

function getDivLabel(num) {
    return (num % 10) === 0 ?
        '%10':
        "!%10";
};

function getTradeLabel(addend1, addend2) {
    var v1 = addend1 % 10;
    var v2 = addend2 % 10;

    return v1 + v2 >= 10 ?
        'trade' :
        '!trade';
};

module.exports = {
    generateSubstractions: function(minuend) {
        var result = _.chain(_.range(1,minuend))
            .map(function(subtrahend) {
                return {
                    minuend:minuend,
                    subtrahend: subtrahend,
                    difference: minuend - subtrahend
                };
            })
            .value();
        return result;
    },

    generateSubstractionQuestion:function(substraction) {
        return {
            equation: substraction,
            text: substraction.minuend + '-' + substraction.subtrahend + '=?',
            answer: substraction.difference,
            input: {type: 0},
            label:['math', '-', getRangeLabel(substraction.minuend), getDivLabel(substraction.minuend), getTradeLabel(substraction.subtrahend, substraction.difference)]
        };
    }
}
