/// <reference path='../league-modals.mdl.ts' />
 
impakt.league.modals.controller('league.modals.createDivisionDuplicateError.ctrl', 
[
'$scope', 
'$uibModalInstance', 
'_league', 
'division',
function(
	$scope: any, 
	$uibModalInstance: any, 
	_league: any, 
	division: any) {

	$scope.division = division;

	$scope.ok = function () {
		$uibModalInstance.close();		
	};

	$scope.cancel = function () {
		$uibModalInstance.dismiss();
	};
}]);