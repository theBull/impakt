/// <reference path='../planning-modals.mdl.ts' />
 
impakt.planning.modals.controller('planning.modals.createScoutCardDuplicateError.ctrl', 
[
'$scope', 
'$uibModalInstance', 
'_planning', 
'scoutCard',
function(
	$scope: any, 
	$uibModalInstance: any, 
	_planning: any, 
	scoutCard: any
) {

	$scope.scoutCard = scoutCard;

	$scope.ok = function () {
		$uibModalInstance.close();		
	};

	$scope.cancel = function () {
		$uibModalInstance.dismiss();
	};
}]);