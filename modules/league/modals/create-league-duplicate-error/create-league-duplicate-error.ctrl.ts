/// <reference path='../league-modals.mdl.ts' />
 
impakt.league.modals.controller('league.modals.createLeagueDuplicateError.ctrl', 
[
'$scope', 
'$uibModalInstance', 
'_league', 
'league',
function(
	$scope: any, 
	$uibModalInstance: any, 
	_league: any, 
	league: any) {

	$scope.league = league;

	$scope.ok = function () {
		$uibModalInstance.close();		
	};

	$scope.cancel = function () {
		$uibModalInstance.dismiss();
	};
}]);