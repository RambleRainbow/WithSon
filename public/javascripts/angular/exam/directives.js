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
            input: '=',
            answer: '='
        },
        link: function($scope, $ele, $attrs) {
            $($ele).find('.numPad').each(function(idx, ele) {
                $(this).on('touchstart', function() {
                    $scope.$apply(function() {
                        $scope.answer += $(ele).text();
                    })
                })
            });

            $($ele).find('.clearBtn').each(function(idx, ele) {
                $(this).on('touchstart', function() {
                    $scope.$apply(function() {
                        $scope.answer = '';
                    });
                });
            });

        },
        template:
            '<div class="row">' +
                '<div class="span10">' +
                    '<div class="row">' +
                        '<button class="btn btn-primary span2 offset5 numPad">1</button>' +
                        '<button class="btn btn-primary span2 numPad">2</button>' +
                        '<button class="btn btn-primary span2 numPad">3</button>' +
                    '</div>' +
                    '<div class="row">' +
                        '<button class="btn btn-primary span2 offset5 numPad">4</button>' +
                        '<button class="btn btn-primary span2 numPad">5</button>' +
                        '<button class="btn btn-primary span2 numPad">6</button>' +
                    '</div>' +
                    '<div class="row">' +
                        '<button class="btn btn-primary span2 offset5 numPad">7</button>' +
                        '<button class="btn btn-primary span2 numPad">8</button>' +
                        '<button class="btn btn-primary span2 numPad">9</button>' +
                    '</div>' +
                    '<div class="row">' +
                        '<button class="btn btn-primary span6 offset5 numPad">0</button>' +
                    '</div>' +
                '</div>' +
                '<div class="span2">' +
                    '<button class="btn span12 clearBtn" >清除</button>' +
                '</div>' +
            '</div>'
    }
})