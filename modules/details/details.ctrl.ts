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

	$scope.selectedElements = _details.selectedElements;
	$scope.selectedElement = null;
	$scope.associatedPlaybooks = [];
	$scope.playbooks;
	$scope._details = _details;

	__context.onReady(function() {
		$scope.playbooks = impakt.context.Playbook.playbooks;
	});

	function init() {
		$scope.selectedElements.onModified(
			function(selectedElements: Common.Interfaces.IActionableCollection) {
				
				// TODO @theBull - open/close details panel when items
				// are selected - currently buggy; isolate scope in expandable directive?
				$scope.collapsed = selectedElements.isEmpty();

				initAssociatedPlaybooks();
			});
	}

	function initAssociatedPlaybooks() {
		if (Common.Utilities.isNullOrUndefined($scope.selectedElements) ||
			$scope.selectedElements.isEmpty())
			return;

		$scope.selectedElement = $scope.selectedElements.first();
		if (Common.Utilities.isNotNullOrUndefined($scope.selectedElement)) {
			
			// get associations
			
		}
	}

	$scope.loadPlaybooks = function(query) {
		let d = $q.defer();
		
		d.resolve(impakt.context.Playbook.playbooks.toJson().playbooks);
		
		return d.promise;
	}

	$scope.associatePlaybook = function(playbookJson: any, play: Common.Models.Play, service: any) {
		if (Common.Utilities.isNullOrUndefined(playbookJson))
			return;

		// add association to play if it isn't already there
		// if(!play.associated.playbooks.exists(playbookJson.guid)) {
		// 	play.associated.setPlaybook(playbookJson.guid);
		// 	service.updatePlay(play);
		// }
	}

	$scope.unassociatePlaybook = function(playbookJson: any, play: Common.Models.Play, service: any) {
		if (Common.Utilities.isNullOrUndefined(playbookJson))
			return;

		// remove association from play if it exists
		// if(play.associated.playbooks.exists(playbookJson.guid)) {
		// 	play.associated.removePlaybook(playbookJson.guid);
		// 	service.updatePlay(play);
		// }
		// remove association from playbook if it exists

	}

	$scope.delete = function(entity: Common.Interfaces.IActionable) {
		_details.delete(entity);
	}

	init();

}]);