/// <reference path='../season-modals.mdl.ts' />
 
impakt.season.modals.controller('season.modals.saveGame.ctrl', 
['$scope', 
'$uibModalInstance', 
'_season', 
'game', 
function(
	$scope: any, 
	$uibModalInstance: any, 
	_season: any,
	game: Season.Models.Game
) {
	
	$scope.game = game;

	$scope.ok = function () {

		_season.updateGame($scope.game)
		.then(function(savedGame) {
			$uibModalInstance.close(savedGame);
		}, function(err) {
			$uibModalInstance.close(err);
		});
	};

	$scope.cancel = function () {
		$uibModalInstance.dismiss();
	};

}]);