angular.module('gwsApp.directives')
.directive('audioPlayer', function(){
	return {
		restrict: 'A',
		replace: true,
		scope:{
			playList:'='
		},
		controller:function($scope){
		},
		link: function ($scope, $elements, $attrs) {
			var playFirstAudio = function(audioPlay, attrs, audioArray){
				if(audioArray && audioArray.length != 0){
					attrs.$set('src', audioArray[0]);
					audioArray.splice(0,1);
					audioPlay.load();
					audioPlay.play();
				}
			};
			
			$scope.$watch('playList', function(newVal, oldVal, scope){
				if(newVal == oldVal){
					$elements.bind('ended', function(e){
						playFirstAudio($elements[0], $attrs, $scope.curPlayList);
					});
				}
				else if(newVal != "")
				{
					$scope.curPlayList = newVal;
					playFirstAudio($elements[0], $attrs, $scope.curPlayList);
				}
				scope.playList = "";
			});
		},
		template:'<audio></audio>'
	};
});