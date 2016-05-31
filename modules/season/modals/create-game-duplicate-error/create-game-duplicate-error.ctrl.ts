/// <reference path='../season-modals.mdl.ts' />
 
impakt.season.modals.controller('season.modals.createGameDuplicateError.ctrl', 
[
'$scope', 
'$uibModalInstance', 
'_season', 
'game',
function(
	$scope: any, 
	$uibModalInstance: any, 
	_season: any, 
	game: any) {

	$scope.game = game;

	$scope.ok = function () {
		$uibModalInstance.close();		
	};

	$scope.cancel = function () {
		$uibModalInstance.dismiss();
	};
}]);