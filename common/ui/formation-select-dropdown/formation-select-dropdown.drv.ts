/// <reference path='../ui.mdl.ts' />

impakt.common.ui.controller('formationSelectDropdown.ctrl', [
'$scope',
function(
	$scope: any
) {

	$scope.formations = impakt.context.Playbook.formations;

}]).directive('formationSelectDropdown', [
function() {

	return {
		restrict: 'E',
		controller: 'formationSelectDropdown.ctrl',
		link: function($scope, $element, attrs) {

		}
	}

}]);