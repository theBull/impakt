/// <reference path='../ui.mdl.ts' />

impakt.common.ui.controller('popout.ctrl', [
'$scope',
'$timeout',
function(
	$scope: any,
	$timeout: any
) {

	$scope.$element;
	$scope.expandable;
	$scope.collection;
	$scope.filteredCollection;
	$scope.optionalType;
	$scope.query = {
		text: ''
	};
	$scope.searchVisible = false;

	$scope.itemSelect = function(item: Common.Interfaces.IAssociable) {
		$scope.expandable.close();
		$scope.select(item, $scope.optionalType);
		//$scope.expandable.label = item.name;
	}

	$scope.toggle = function(e: any) {
		if($scope.filteredCollection && $scope.filteredCollection.isEmpty())
			return;

		$scope.expandable.toggle();
		$scope.searchVisible = !$scope.expandable.collapsed;
		if($scope.searchVisible) {
			$timeout(function() {
				$scope.$element.find('input').focus();
			}, 1);
		} else {
			$scope.query.text = '';
		}
	}

	$scope.close = function() {
		$scope.searchVisible = false;
		$scope.expandable.close();
	}

	$scope.filterCollection = function() {
		if (Common.Utilities.isNotNullOrUndefined($scope.filterBy) &&
			Common.Utilities.isNotNullOrUndefined($scope.filterValue)) {
			$scope.filter = {};
			$scope.filter[$scope.filterBy] = $scope.filterValue;
			try {
				if (Common.Utilities.isNotNullOrUndefined($scope.filter) &&
					Common.Utilities.isNotNullOrUndefined($scope.collection)) {

					$scope.filteredCollection = $scope.collection.filterCollection($scope.filter);

				}
			} catch (e) {
				console.error(e);
			}
		}
	}

	$scope.setLabel = function() {

	}

}]).directive('popout', [
'$rootScope',
'$filter',
'$timeout',
function(
	$rootScope: any,
	$filter: any,
	$timeout: any
) {

return {
	restrict: 'E',
	controller: 'popout.ctrl',
	scope: {
		root: '=',
		label: '=',
		direction: '@',
		collapsed: '@?',
		url: '@',
		collection: '=',
		select: '=',
		type: '@',
		filterBy: '@',
		filterValue: '='
	},
	transclude: true,
	replace: true,
	templateUrl: 'common/ui/popout/popout.tpl.html',
	link: function($scope, $element, attrs) {

		$scope.$element = $element;
		$scope.expandable = new Common.Models.Expandable($element);

		$timeout(function() {

			$scope.optionalType = Common.Utilities.parseEnumFromString($scope.type);
			$scope.expandable.url = $scope.url;
			$scope.expandable.direction = $scope.direction;
			$scope.expandable.collapsed = Boolean($scope.collapsed) === false ? false : true;
			$scope.expandable.expandable = false;
			$scope.expandable.label = $scope.label;
			$scope.expandable.initializeToggleHandle();
			$scope.expandable.ready = true;
			$scope.filterCollection();

		}, 1);

		$scope.$element.click(function(e: any) {
			e.stopPropagation();
		});	

		$scope.expandable.onopen(function() {

			$rootScope.$broadcast('popout-opened', $scope.expandable.guid);

			$('html').on('click.popout-clickeater', function(e: any) {
				$scope.close();
				$scope.$apply();
			}).on('keyup.popout-keyboard', function(e: any) {
				if (e.keyCode == Common.Input.Which.Esc) {
					$scope.close();
					$scope.$apply();
				} 
				if(e.keyCode == Common.Input.Which.Enter) {

				}				
			});

		});
		$scope.expandable.onclose(function() {
			$('html').off('click.popout-clickeater').off('popout-keyboard');
			$scope.searchVisible = false;
		});

		$rootScope.$on('popout-opened', function(e, guid: string) {
			if (guid != $scope.expandable.guid) {
				$scope.close();
			}
		});

		$scope.$watch('root', function(newVal, oldVal) {
			if(!newVal)
				return;

			if (!oldVal || newVal.guid != oldVal.guid) {
				$scope.expandable.label = $scope.label;
				$scope.filterCollection();
			}
		});
	}
}

}]).directive('popoutToggle', [
function() {
	return {
		restrict: 'E',
		controller: 'popout.ctrl',
		require: '^popout',
		replace: true,
		transclude: true,
		templateUrl: 'common/ui/popout/popout-toggle.tpl.html',
		link: function($scope, $element, attrs) {
			/**
			 * Initialize the toggle handle
			 */
			if(Common.Utilities.isNotNullOrUndefined($scope.expandable))
				$scope.expandable.initializeToggleHandle();
		}
	}
}]).directive('popoutContents', [function() {
	return {
		restrict: 'E',
		controller: 'popout.ctrl',
		require: '^popout',
		scope: {
			collection: '='
		},
		link: function($scope, $element, attrs) {}
	}
}])
.directive('popoutClickeater', [function() {
	return {
		restrict: 'E',
		scope: true,
		replace: true,
		transclude: true,
		templateUrl: 'common/ui/popout/popout-clickeater.tpl.html',
		link: function($scope, $element, attrs) {

		}
	}
}]);