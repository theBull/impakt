/// <reference path='../ui.mdl.ts' />


impakt.common.ui.controller('impaktDatepicker.ctrl', [
'$scope',
function(
	$scope: any
) {

	$scope.datetime;
	$scope.popup;

	$scope.togglePopup = function(open?: boolean) {
		$scope.popup.opened = open === true ? true : !$scope.popup.opened;
	}

	$scope.updateMethod = function() {
		$scope.update();
	}

}]).directive('impaktDatepicker', [
function(
) {

	return {
		restrict: 'E',
		controller: 'impaktDatepicker.ctrl',
		templateUrl: 'common/ui/impakt-datepicker/impakt-datepicker.tpl.html',
		transclude: true,
		replace: false,
		scope: {
			datetime: '=',
			update: '&?'
		},
		link: function($scope: any, $element: any, attrs: any) {
			$scope.popup = $scope.datetime.popup;
		}
	}

}])