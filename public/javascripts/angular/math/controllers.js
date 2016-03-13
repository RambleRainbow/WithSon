/**
 * Created by 灵 on 2016/3/4.
 */
angular.module('mathApp.controllers')
.controller( 'mathController', ['$scope', function examController($scope) {
    $scope.rightTimes = 2;
    $scope.speedRestriction = 10;
    $scope.memoryInterval = 0;
    $scope.questionCount = 20;

    $scope.onStartExam = function(examId) {
        window.open('/exam?id=' + examId +
            '&times=' + $scope.rightTimes +
            '&count=' + $scope.questionCount +
            '&interval=' + $scope.memoryInterval +
            '&speed=' + $scope.speedRestriction
        );
    }
}]);
