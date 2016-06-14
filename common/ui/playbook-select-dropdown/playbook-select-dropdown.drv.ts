/// <reference path='../ui.mdl.ts' />

impakt.common.ui.controller('playbookSelectDropdown.ctrl', [
'$scope',
function(
	$scope: any
) {

	$scope.playbooks = impakt.context.Playbook.playbooks;

}]).directive('playbookSelectDropdown', [
function() {

	return {
		restrict: 'E',
		controller: 'playbookSelectDropdown.ctrl',
		link: function($scope, $element, attrs) {

		}
	}

}]);