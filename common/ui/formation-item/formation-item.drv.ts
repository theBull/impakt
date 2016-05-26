/// <reference path='../ui.mdl.ts' />

impakt.common.ui.controller('formationItem.ctrl', [
'$scope',
'_playbook',
'_details',
function(
	$scope: any,
	_playbook: any,
	_details: any
) {

	$scope.play;
	$scope.element;

	/**
	 *
	 *	Item selection
	 * 
	 */
	$scope.toggleSelection = function(formation: Common.Models.Formation) {
		_details.toggleSelection(formation);
	}

	$scope.openInEditor = function(formation: Common.Models.Formation) {
		_playbook.editFormation(formation);
	}
	
}]).directive('formationItem', [
function(

) {
	/**
	 * play-item directive
	 */
	return {
		restrict: 'E',
		controller: 'formationItem.ctrl',
		scope: {
			formation: '='
		},
		templateUrl: 'common/ui/formation-item/formation-item.tpl.html',
		transclude: true,
		replace: true,
		compile: function compile(tElement, tAttrs, transclude) {
			return {
				pre: function preLink($scope, $element, attrs, controller) { },
				post: function postLink($scope, $element, attrs, controller) {
					$scope.$element = $element;				

					
				}
			}
		}
	}
}]);