/// <reference path='./playbook-contextmenus-routeNode.mdl.ts' />

impakt.playbook.contextmenus.routeNode.controller(
'impakt.playbook.contextmenus.routeNode.ctrl',
['$scope', '_playbookContextmenusRouteNode', 
	function(
		$scope: any, 
		_playbookContextmenusRouteNode: any) {

	console.log('assignment node controller',
		_playbookContextmenusRouteNode.context);

	$scope.context = _playbookContextmenusRouteNode.context;
	$scope.actions = _playbookContextmenusRouteNode.getActions();

	$scope.actionClick = function(action) {
		if($scope.context.actionable) {
			_playbookContextmenusRouteNode.selectAction(action);		
		} else {
			console.log('Route node is non-actionable');
		}
	}

}]);