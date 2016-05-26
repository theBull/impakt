/// <reference path='../league-modals.mdl.ts' />
 
impakt.league.modals.controller('league.modals.createConferenceDuplicateError.ctrl', 
[
'$scope', 
'$uibModalInstance', 
'_league', 
'conference',
function(
	$scope: any, 
	$uibModalInstance: any, 
	_league: any, 
	conference: any) {

	$scope.conference = conference;

	$scope.ok = function () {
		$uibModalInstance.close();		
	};

	$scope.cancel = function () {
		$uibModalInstance.dismiss();
	};
}]);