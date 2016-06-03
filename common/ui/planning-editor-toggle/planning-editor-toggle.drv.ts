/// <reference path='../ui.mdl.ts' />

impakt.common.ui.controller('planningEditorToggle.ctrl', [
'$scope',
function(
	$scope: any
) {

	$scope.item;

	$scope.toggle = function() {
		$scope.item.toggleSelect();
	}

}]).directive('planningEditorToggle', [
function() {
	return {
		restrict: 'E',
		controller: 'planningEditorToggle.ctrl',
		templateUrl: 'common/ui/planning-editor-toggle/planning-editor-toggle.tpl.html',
		transclude: true,
		replace: true,
		scope: {
			item: '='
		},
		link: function($scope: any, $element: any, attrs: any) {

		}
	}
}]);