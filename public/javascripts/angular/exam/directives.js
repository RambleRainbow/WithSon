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
            displayQuestion: '=',
            triggerFadeout: '=',
        },
        controller: function($scope) {
            $scope.text = '';
        },
        link: function($scope, $eles, $attrs) {
            var lastTask = null;
            $scope.$watch('triggerFadeout', function(newValue, oldValue, scope) {
                if(newValue == 0) return;

                var task = function(t) {
                    $($eles[0]).css('display','block');
                    setTimeout(function() {
                        $($eles[0]).fadeOut(300, function() {
                            if(lastTask !== t) {
                                lastTask(lastTask);
                            } else {
                                lastTask = null;
                            }
                        });
                    }, newValue * 1000);
                };

                if(lastTask === null) {
                    task(task);
                };
                lastTask = task;

                $scope.triggerFadeout = 0;
            })
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
                        '<div class="btn btn-primary span4 numPad">1</div>' +
                        '<div class="btn btn-primary span4 numPad">2</div>' +
                        '<div class="btn btn-primary span4 numPad">3</div>' +
                    '</div>' +
                    '<div  class="row"  style="margin-left:20px">' +
                        '<div class="btn btn-primary span4 numPad">4</div>' +
                        '<div class="btn btn-primary span4 numPad">5</div>' +
                        '<div class="btn btn-primary span4 numPad">6</div>' +
                    '</div>' +
                    '<div  class="row"  style="margin-left:20px">' +
                        '<div class="btn btn-primary span4 numPad">7</div>' +
                        '<div class="btn btn-primary span4 numPad">8</div>' +
                        '<div class="btn btn-primary span4 numPad">9</div>' +
                    '</div>' +
                    '<div class="row"  style="margin-left:20px">' +
                        '<div class="btn btn-primary span12 numPad">0</div>' +
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
.directive('spinButton', function(){
    return {
        restrict: 'A',
        replace: true,
        scope:{
            clickEvent: '&',
            caption: '@'
        },
        controller:function($scope) {
        },
        link: function($scope, $eles, $attrs) {
            $($eles[0]).on('touchstart', function() {
                $scope.$apply(function () {
                    $scope.clickEvent();
                })
            });
        },
        template:'<div class="next btn btn-danger span12">{{caption}}</div>'
    }
})