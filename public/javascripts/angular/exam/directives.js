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
                '<div class="span4">' +
                    '<div class="row" style="margin-left:20px">' +
                        '<button class="btn btn-primary span4 numPad">1</button>' +
                        '<button class="btn btn-primary span4 numPad">2</button>' +
                        '<button class="btn btn-primary span4 numPad">3</button>' +
                    '</div>' +
                    '<div  class="row"  style="margin-left:20px">' +
                        '<button class="btn btn-primary span4 numPad">4</button>' +
                        '<button class="btn btn-primary span4 numPad">5</button>' +
                        '<button class="btn btn-primary span4 numPad">6</button>' +
                    '</div>' +
                    '<div  class="row"  style="margin-left:20px">' +
                        '<button class="btn btn-primary span4 numPad">7</button>' +
                        '<button class="btn btn-primary span4 numPad">8</button>' +
                        '<button class="btn btn-primary span4 numPad">9</button>' +
                    '</div>' +
                    '<div class="row"  style="margin-left:20px">' +
                        '<button class="btn btn-primary span12 numPad">0</button>' +
                    '</div>' +
                '</div>' +
                '<div class="span2">' +
                    '<button class="clearBtn btn span12" >清除</button>' +
                '</div>' +
            '</div>'
    }
})
.directive('wavPlayer', function(){
    return {
        restrict: 'A',
        replace: true,
        scope:{
            wavFile: '='
        },
        controller:function($scope) {
        },
        link: function($scope, $eles, $attr) {
            $scope.$watch('wavFile', function(newVal, oldVal, scope) {
                console.log(oldVal + ',' + newVal);
                if(newVal === undefined || (newVal === "")) return;
                $attr.$set('src', newVal);
                $eles[0].load();
                $eles[0].play();
                $scope.wavFile = '';
            })
        },
        template:'<audio style="display:none"></audio>'
    }
})