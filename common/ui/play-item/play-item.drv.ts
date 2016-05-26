/// <reference path='../ui.mdl.ts' />

impakt.common.ui.controller('playItem.ctrl', [
'$scope',
'_details',
'_playbook',
function(
	$scope: any,
	_details: any,
	_playbook: any
) {

	$scope.play;
	$scope.element;

	/**
	 *
	 *	Item selection
	 * 
	 */
	$scope.toggleSelection = function(play: Common.Models.Play) {
		_details.toggleSelection(play);
	}

	$scope.openInEditor = function(play: Common.Models.Play) {
		_playbook.editPlay(play);
	}
	
}]).directive('playItem', [
function(

) {
	/**
	 * play-item directive
	 */
	return {
		restrict: 'E',
		controller: 'playItem.ctrl',
		scope: {
			play: '='
		},
		templateUrl: 'common/ui/play-item/play-item.tpl.html',
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