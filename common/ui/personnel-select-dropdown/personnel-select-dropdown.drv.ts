/// <reference path='../ui.mdl.ts' />

impakt.common.ui.controller('personnelSelectDropdown.ctrl', [
'$scope',
function(
	$scope: any
) {

	$scope.personnels = impakt.context.Team.personnel;

}]).directive('personnelSelectDropdown', [
function() {

	return {
		restrict: 'E',
		controller: 'personnelSelectDropdown.ctrl',
		link: function($scope, $element, attrs) {

		}
	}

}]);