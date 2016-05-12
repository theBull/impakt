/// <reference path='./main.mdl.ts' />

impakt.main.controller('main.ctrl', [
'$scope',
'__context',
function(
	$scope: any,
	__context: any
) {

	$scope.appVisible = false;

	__context.onReady(function() {
		$scope.appVisible = true;
		
		if (!$scope.$$phase) {
			$scope.$apply();
		}
	});

}]);