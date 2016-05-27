/// <reference path='./search.mdl.ts' />

impakt.search.controller('search.ctrl',[
'$scope', 
'__context',
function(
	$scope: any,
	__context: any
) {
	$scope.title = 'Results';
	$scope.query = '';
	$scope.playbooks;
	$scope.formations;
	$scope.plays;

	// attach key listeners

	__context.onReady(function() {
		$scope.playbooks = impakt.context.Playbook.playbooks;
		$scope.formations = impakt.context.Playbook.formations;
		$scope.plays = impakt.context.Playbook.plays;
	});

	$scope.$on("$destroy", function() {
        
    });
	
}]);