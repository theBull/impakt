/// <reference path='../user-modals.mdl.ts' />
 
impakt.user.modals.controller('user.modals.selectOrganization.ctrl', 
[
'$scope', 
'$uibModalInstance', 
'_user',  
function(
	$scope: any, 
	$uibModalInstance: any, 
	_user: any
) {

	$scope.selectedOrganization = _user.selectedOrganization;
	$scope.organizations = _user.organizations;

	$scope.organizationSelected = function() {
		console.log('selected organization', $scope.selectedOrganization);
	}

	$scope.ok = function () {
		_user.selectOrganization($scope.selectedOrganization)
		.then(function(selectedOrganization: User.Models.Organization) {
			$uibModalInstance.close(selectedOrganization);
		}, function(err) {
			$uibModalInstance.close(err);
		});
	};

	$scope.cancel = function () {
		$uibModalInstance.dismiss();
	};

}]);