/// <reference path='../season-modals.mdl.ts' />
 
impakt.season.modals.controller('season.modals.deleteGame.ctrl', [
'$scope', 
'$rootScope',
'$uibModalInstance', 
'_season', 
'game',
function(
	$scope: any, 
	$rootScope: any,
	$uibModalInstance: any, 
	_season: any, 
	game: any) {

	$scope.game = game;

	$scope.ok = function () {
		_season.deleteGame($scope.game)
		.then(function(results) {
			$rootScope.$broadcast('delete-game', $scope.game);
			$uibModalInstance.close(results);
		}, function(err) {
			console.error(err);
			$uibModalInstance.close(err);
		});
		
	};

	$scope.cancel = function () {
		$uibModalInstance.dismiss();
	};
}]);