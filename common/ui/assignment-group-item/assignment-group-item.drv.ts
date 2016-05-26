/// <reference path='../ui.mdl.ts' />

impakt.common.ui.controller('assignmentGroupItem.ctrl', [
'$scope',
'_playbook',
'_details',
function(
	$scope: any,
	_playbook: any,
	_details: any
) {

	$scope.assignmentGroup;
	$scope.element;

	/**
	 *
	 *	Item selection
	 * 
	 */
	$scope.toggleSelection = function(assignmentGroup: Common.Models.AssignmentGroup) {
		_details.toggleSelection(assignmentGroup);
	}
	
}]).directive('assignmentGroupItem', [
function(

) {
	/**
	 * assignment-group-item directive
	 */
	return {
		restrict: 'E',
		controller: 'assignmentGroupItem.ctrl',
		scope: {
			assignmentGroup: '=assignmentgroup'
		},
		templateUrl: 'common/ui/assignment-group-item/assignment-group-item.tpl.html',
		transclude: true,
		replace: true,
		link: function($scope, $element, attrs) {
			$scope.$element = $element;				
		}
	}
}]);