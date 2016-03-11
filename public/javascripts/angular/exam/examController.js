/**
 * Created by 灵 on 2016/3/4.
 */
console.log('load controller');
angular.module('examApp.controllers')
.controller( 'examController', ['$scope', function examController($scope) {
    var exam = new Exam(examPaper);
    $scope.wavFile = '';

    $scope.onclicknext = function() {
        if($scope.curSubject) {
            if($scope.curSubject.answer === "") {
                return;
            }
        }

        var isRight = exam.checkAnswer();
        if(isRight !== undefined && isRight == false) {
            $scope.wavFile = '/audios/wrong.mp3';
        }
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
                        if(result.errorCode === 0) {
                            window.location.href= "/exam/statistics?id=" + result.examid;
                        } else {
                            alert(result.reason);
                        }
                    }
                }
            )
        }
    }

    $scope.onclickprev = function() {
        curSubject = exam.getPrevSubject();
    }
}]);
