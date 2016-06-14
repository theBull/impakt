/// <reference path='../ui.mdl.ts' />

impakt.common.ui.controller('assignmentGroupSelectDropdown.ctrl', [
'$scope',
function(
	$scope: any
) {

	$scope.assignmentGroups = impakt.context.Playbook.assignmentGroups;

}]).directive('assignmentGroupSelectDropdown', [
function() {

	return {
		restrict: 'E',
		controller: 'assignmentGroupSelectDropdown.ctrl',
		link: function($scope, $element, attrs) {

		}
	}

}]);