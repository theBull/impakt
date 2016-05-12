/// <reference path='../playbook-modals.mdl.ts' />
 
impakt.playbook.modals.controller('playbook.modals.deleteAssignmentGroup.ctrl', 
[
'$scope', 
'$uibModalInstance', 
'_associations',
'_playbook', 
'assignmentGroup',
function(
	$scope: any, 
	$uibModalInstance: any, 
	_associations: any,
	_playbook: any, 
	assignmentGroup: any) {

	$scope.assignmentGroup = assignmentGroup;

	$scope.ok = function () {
		_playbook.deleteAssignmentGroup($scope.assignmentGroup)
		.then(function(results) {
			_associations.deleteAssociations($scope.assignmentGroup.associationKey);
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