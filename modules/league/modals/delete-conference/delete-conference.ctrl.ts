/// <reference path='../league-modals.mdl.ts' />
 
impakt.league.modals.controller('league.modals.deleteConference.ctrl', [
'$scope', 
'$rootScope',
'$uibModalInstance', 
'_league', 
'conference',
function(
	$scope: any, 
	$rootScope: any,
	$uibModalInstance: any, 
	_league: any, 
	conference: any) {

	$scope.conference = conference;

	$scope.ok = function () {
		_league.deleteConference($scope.conference)
		.then(function(results) {
			$rootScope.$broadcast('delete-conference', $scope.conference);
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