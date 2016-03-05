/**
 * Created by 灵 on 2016/3/4.
 */
console.log('load directives');
angular.module('examApp.directives')
.directive('examQuestion', function() {
    return {
        restrict: 'A',
        replace: true,
        scope: {
            displayQuestion: '='
        },
        template:'<div class="question">{{displayQuestion}}</div>'
    };
})
.directive('examAnswer', function() {
    return {
        restrict: 'A',
        replace:true,
        scope:{
            answer: '='
        },
        template:'<div class="answer">{{answer}}</div>'
    }
})
.directive('examInput', function() {
    return {
        restrict: 'A',
        replace:true,
        scope:{
            input: '='
        },
        template:
            '<div>' +
            '<div class="row"><div class="span1 offset5 numPad">1</div><div class="span1 numPad">2</div><div class="span1 numPad">3</div></div>' +
            '<div class="row"><div class="span1 offset5 numPad">4</div><div class="span1 numPad">5</div><div class="span1 numPad">6</div></div>' +
            '<div class="row"><div class="span1 offset5 numPad">7</div><div class="span1 numPad">8</div><div class="span1 numPad">9</div></div>' +
            '<div class="row"><div class="span3 offset5 numPad">0</div></div>' +
            '</div>'
    }
})