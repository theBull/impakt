/// <reference path='../ui.mdl.ts' />

impakt.common.ui.controller('appLoading.ctrl', [
'$scope',
'$timeout',
'__context',
'__notifications',
function(
	$scope: any,
	$timeout: any,
	__context: any,
	__notifications: any
) {

	$scope.$element;
	$scope.visible = false;
	$scope.notifications = __notifications.notifications;
	$scope.notification;

	$scope.notifications.onModified(function(collection) {
		$scope.notification = collection.getLast();

		if(!$scope.$$phase)
			$scope.$apply();
	});

	$scope.skip = function() {
		$scope.visible = false;
	}

	__context.onInitializing(function() {
		$scope.visible = true;
	});

	__context.onReady(function() {
		// simulate a slight delay to let the user
		// see that all of their data has been loaded
		// before removing the loading screen
		$timeout(function() { 
			$scope.visible = false;
		}, 1000);
	});

}])
.directive('appLoading', [
function() {
	return {
		restrict: 'E',
		templateUrl: 'common/ui/app-loading/app-loading.tpl.html',
		transclude: true,
		replace: true,
		controller: 'appLoading.ctrl',
		link: function($scope, $element, attrs) {
			$scope.$element = $element;
		}
	}
}]);