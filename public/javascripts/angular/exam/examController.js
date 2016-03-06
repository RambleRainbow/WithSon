/**
 * Created by 灵 on 2016/3/4.
 */
console.log('load controller');
angular.module('examApp.controllers')
.controller( 'examController', ['$scope', function examController($scope) {
    var exam = new Exam(examPaper);

    $scope.nextSubject = function() {
        $scope.curSubject = exam.getNextSubject();
        if($scope.curSubject == null) {
            alert('finished');
        }
    }

    $scope.prevSubject = function() {
        curSubject = exam.getPrevSubject();
    }
}]);
