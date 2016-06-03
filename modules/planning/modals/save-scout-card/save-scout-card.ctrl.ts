/// <reference path='../planning-modals.mdl.ts' />
 
impakt.planning.modals.controller('planning.modals.saveScoutCard.ctrl', 
['$scope', 
'$uibModalInstance', 
'_planning', 
'scoutCard', 
function(
	$scope: any, 
	$uibModalInstance: any, 
	_planning: any,
	scoutCard: Planning.Models.ScoutCard
) {
	
	$scope.scoutCard = scoutCard;

	$scope.ok = function () {

		_planning.updateScoutCard($scope.scoutCard)
		.then(function(savedScoutCard) {
			$uibModalInstance.close(savedScoutCard);
		}, function(err) {
			$uibModalInstance.close(err);
		});
	};

	$scope.cancel = function () {
		$uibModalInstance.dismiss();
	};

}]);