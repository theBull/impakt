/// <reference path='../league-modals.mdl.ts' />
 
impakt.league.modals.controller('league.modals.saveConference.ctrl', 
['$scope', 
'$uibModalInstance', 
'_league', 
'conference', 
function(
	$scope: any, 
	$uibModalInstance: any, 
	_league: any,
	conference: League.Models.Conference
) {
	
	$scope.conference = conference;

	$scope.ok = function () {

		_league.updateConference($scope.conference)
		.then(function(savedConference) {
			$uibModalInstance.close(savedConference);
		}, function(err) {
			$uibModalInstance.close(err);
		});
	};

	$scope.cancel = function () {
		$uibModalInstance.dismiss();
	};

}]);