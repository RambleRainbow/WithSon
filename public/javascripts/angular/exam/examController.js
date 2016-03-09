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
            $.ajax(
                {
                    type: "POST",
                    url: "/exam/create",
                    contentType: "application/json;charset=utf8",
                    data: JSON.stringify({paper: exam.examInfo, subjects: exam.subjects}),
                    dataType: "json",
                    success: function (result) {
                        alert(result);
                    }
                }
            )
        }
    }

    $scope.prevSubject = function() {
        curSubject = exam.getPrevSubject();
    }
}]);
