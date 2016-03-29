/// <reference path='./notifications.mdl.ts' />

impakt.common.notifications.controller('notifications.ctrl', [
'$scope',
'__notifications',
function($scope: any, __notifications: any) {
	$scope.notifications = __notifications.notifications;
	$scope.notificationTypes = __notifications.notificationTypes;

	$scope.test = function() {
		let index = Math.floor((Math.random() * $scope.notificationTypes.length));
		__notifications.notify(
			'test notification!',
			<Common.Models.NotificationType>index
		);
	}
	$scope.clearAll = function() {
		__notifications.removeAll();
	}
	$scope.remove = function(guid) {
		__notifications.remove(guid);
	}
}]).directive('notifications', [
'$compile', '__notifications',
function($compile: any, __notifications: any) {

	return {
		restrict: 'E',
		templateUrl: 'common/notifications/notifications.tpl.html',
		controller: 'notifications.ctrl',
		link: function($scope: any, $element: any, attrs) {

		}
	}

}])
.directive('notificationItem',[function() {
	return {
		restrict: 'E',
		templateUrl: 'common/notifications/notification-item.tpl.html',
		controller: 'notifications.ctrl',
		link: function($scope: any, $element: any, attrs) {
			console.log('notifications type', attrs.type);
			let css = '';
			switch(attrs.type) {

			}
		}
	}
}]);