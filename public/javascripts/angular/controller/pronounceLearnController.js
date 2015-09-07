angular.module('gwsApp.controllers')
	.controller( 'PronounceLearnController', ['$scope', '$http', function PronounceLearnControler($scope, $http )
{
	$scope.alphabets = undefined;
	$scope.cellInfos = undefined;
	$scope.displayType = ''; //random all lower upper
	$scope.orderType = ''; //asc random
	$scope.studyMode = ''; //p2a a2p
	$scope.audioRes = undefined;
	
	$scope.initCellInfos = function(datas){
	    $scope.cellInfos = new Array();
	    for(i = 0; i < datas.length; i++){
	      	  $scope.cellInfos[i] = {text:"A", audios:"", data:null};
	      	  $scope.cellInfos[i].text = datas[i].text;
	      	  $scope.cellInfos[i].audios = datas[i].pronouce;
	 		  $scope.cellInfos[i].data = datas[i];
	    }
	};
	
	$http.get('datas?type=alphabet').success(function(data){
		$scope.alphabets = data;
		$scope.initCellInfos($scope.alphabets);
		
		$scope.displayType = 'random';
		$scope.orderType = 'random';
		$scope.studyMode = 'a2p';
	});
	
	$scope.randomAlphabet = function(){
		if($scope.alphabets != undefined){
			$scope.curAlphabet = $scope.alphabets[(Math.round(Math.random() * ($scope.alphabets.length - 1)))];
		}
	};
	
	$scope.checkUserClick = function(alphabet){
		if($scope.studyMode == 'a2p'){
			$scope.playAudioRes([alphabet.pronouce]);
		}else{
			if($scope.curAlphabet.ch == alphabet.ch){
				$scope.randomAlphabet();
				$scope.playAudioRes(['audios/right.mp3', $scope.curAlphabet.pronouce]);
			}else{
				$scope.playAudioRes(['audios/wrong.mp3', $scope.curAlphabet.pronouce]);
			}
		}
	};
	
	$scope.playAudioRes  = function(aAudios){
		$scope.audioList = aAudios;
	};
	
	$scope.randomCellInfos = function(){
		if($scope.cellInfos){
			var aReturn = new Array();
			var nLen = 0;
			
			for(i = 0; i < $scope.cellInfos.length; i++){
				aReturn[i] = $scope.cellInfos[i];
			}
			
			while(aReturn.length > 0){
				var nIndex = Math.round(Math.random() * (aReturn.length - 1));
				$scope.cellInfos[nLen] = aReturn[nIndex];
				nLen = nLen + 1;
				aReturn.splice(nIndex, 1);
			}
		}
	};
	
	$scope.compareCellInfos = function (a, b){
		return (a.data.lower > b.data.lower)? 1 : -1;
	};

	$scope.sortCellInfos = function(){
		$scope.cellInfos.sort($scope.compareCellInfos);
	};


	$scope.$watch('displayType', function(value){
		if($scope.cellInfos != undefined && value != undefined){
			for(i = 0; i < $scope.cellInfos.length; i++){
				switch(value){
					case 'all':$scope.cellInfos[i].text = $scope.cellInfos[i].data.upper + $scope.cellInfos[i].data.lower;break;
					case 'upper':$scope.cellInfos[i].text = $scope.cellInfos[i].data.upper;break;
					case 'random':$scope.cellInfos[i].text = ((Math.random() > 0.5) ? $scope.cellInfos[i].data.upper : $scope.cellInfos[i].data.lower); break;
					case 'lower':$scope.cellInfos[i].text = $scope.cellInfos[i].data.lower;break;
					default:$scope.cellInfos[i].text = $scope.cellInfos[i].data.upper + $scope.cellInfos[i].data.lower;
				};
				
			}
		}
	}); 
	$scope.$watch('studyMode', function(value){
		$scope.studyMode = value;
		$scope.randomAlphabet();
		if(value == 'p2a'){
			$scope.playAudioRes([$scope.curAlphabet.pronouce]);
		}
	});
	
	$scope.$watch('orderType', function(value){
		if(value=='asc'){
			$scope.sortCellInfos();
		} else {
			$scope.randomCellInfos();
		};
	});
}]);