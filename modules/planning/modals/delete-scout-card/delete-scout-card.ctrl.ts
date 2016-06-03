/// <reference path='../planning-modals.mdl.ts' />
 
impakt.planning.modals.controller('planning.modals.deleteScoutCard.ctrl', [
'$scope', 
'$rootScope',
'$uibModalInstance', 
'_planning', 
'scoutCard',
function(
	$scope: any, 
	$rootScope: any,
	$uibModalInstance: any, 
	_planning: any, 
	scoutCard: any
) {

	$scope.scoutCard = scoutCard;

	$scope.ok = function () {
		_planning.deleteScoutCard($scope.scoutCard)
		.then(function(results) {
			$rootScope.$broadcast('delete-scoutCard', $scope.scoutCard);
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