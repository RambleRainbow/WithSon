/**
 * Created by 灵 on 2016/3/4.
 */
console.log('load controller');
angular.module('examApp.controllers')
    .controller( 'examController', ['$scope', function examController($scope) {
        $scope.curSubject = {
            question: "11-3=?",
            answer:"8",
            input:"test"
        }

        $scope.nextSubject = function() {
            $scope.curSubject = {
                question:"12-9=?",
                answer:"3",
                input:"test"
            }
        }
    }]);
