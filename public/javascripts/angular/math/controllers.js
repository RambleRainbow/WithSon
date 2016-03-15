/**
 * Created by 灵 on 2016/3/4.
 */
angular.module('mathApp.controllers')
.controller( 'mathController', ['$scope', function examController($scope) {
    $scope.correctNumber = 2;
    $scope.timeLimit = 0;
    $scope.memorySpan = 0;
    $scope.questionCount = 20;

    $scope.onStartExam = function(examId) {
        window.open('/exam?id=' + examId +
            '&correctNumber=' + $scope.correctNumber +
            '&count=' + $scope.questionCount +
            '&memorySpan=' + $scope.memorySpan +
            '&timeLimit=' + $scope.timeLimit
        );
    }
}]);
