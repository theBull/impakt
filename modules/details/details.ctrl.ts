/// <reference path='./details.mdl.ts' />

impakt.details.controller('details.ctrl', 
['$scope',
'$q',
'$timeout',
'__context',
'__modals', 
'_details', 
'_associations',
function(
	$scope: any, 
	$q: any,
	$timeout: any,
	__context: any,
	__modals: any, 
	_details: any,
	_associations: any
) {

	$scope.expandable = $scope.expandable;
	$scope.selectedElements = _details.selectedElements;
	$scope.selectedElement = null;
	$scope.associations = new Common.Models.AssociationResults();
	$scope.populatedAssociationKeys = [];
	$scope.playbooks;
	$scope._details = _details;
	$scope.collapsed = Common.Utilities.isNotNullOrUndefined($scope.expandable) ? $scope.expandable.collapsed : true;

	__context.onReady(function() {
		$scope.playbooks = impakt.context.Playbook.playbooks;
	});

	function init() {
		$scope.selectedElements.clearListeners();
		$scope.selectedElements.onModified(
			function(selectedElements: Common.Interfaces.IActionableCollection) {

				if(Common.Utilities.isNotNullOrUndefined($scope.expandable)) {
					$scope.selectedElements.isEmpty() ?
						!$scope.expandable.collapsed && $scope.expandable.close() :
						$scope.expandable.collapsed && $scope.expandable.open();
				}
				_initAssociated();
			});

		// Load initial associations, don't wait for the modification handler
		// for selected elements to fire.
		_initAssociated();
	}

	function _initAssociated() {
		if (Common.Utilities.isNullOrUndefined($scope.selectedElements) ||
			$scope.selectedElements.isEmpty())
			return;

		$scope.selectedElement = $scope.selectedElements.first();
		if (Common.Utilities.isNotNullOrUndefined($scope.selectedElement)) {
			
			$scope.associations = _associations.getAssociated($scope.selectedElement);
			$scope.populatedAssociationKeys = $scope.associations.getPopulatedAssociationKeys();
			
		}
	}

	$scope.delete = function(entity: Common.Interfaces.IActionable) {
		_details.delete(entity);
	}

	init();

}]);