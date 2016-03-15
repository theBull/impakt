/// <reference path='../ui.mdl.ts' />

impakt.common.ui.controller('stepper.ctrl', [
'$scope', 
function($scope: any) {
	console.info('stepper directive controller');

	$scope.index = 0;
	$scope.steps = [];

	$scope.$element = null;

	$scope.to = function(index: number) {
		$($scope.$element.find('step')[index]).show();
		$($scope.$element.find('step')[$scope.index]).hide();

		$scope.index = index;
	}

	$scope.prev = function() {
		if($scope.index - 1 >= 0)
			$scope.to($scope.index - 1);
	}
	$scope.next = function() {
		if($scope.index + 1 < $scope.steps.length) 
			$scope.to($scope.index + 1);
	}

	$scope.isVisible = function() {
		return true;
	}

}]).directive('stepper', [
'$compile',
function($compile: any) {
	return {
		restrict: 'E',
		controller: 'stepper.ctrl',
		compile: function compile(tElement, tAttrs, transclude) {
			return {
				pre: function preLink($scope, $element, attrs, controller) {
				},
				post: function postLink($scope, $element, attrs, controller) {
					

					let mode = attrs.mode;
					let HTML = '<step-nav>\
									<step-nav-item ng-repeat="step in steps track by $index" \
										class="gray-bg-7-hover"\
										ng-click="to($index)">\
										{{$index + 1}}\
									</step-nav-item>\
								</step-nav>';
					
					let el = angular.element($compile(HTML)($scope));
					//$element.append(el);

					$scope.$element = $element;
				}
			}
		}
	}
}]).directive('step', [
'$compile',
function($compile: any) {
	return {
		restrict: 'E',
		compile: function compile(tElement, tAttrs, transclude) {
			return {
				pre: function preLink($scope, $element, attrs, controller) {
					
					let guid = Common.Utilities.guid();
					$element.attr('guid', guid);

					let index = $scope.steps.length;
					let step = {
						guid: guid,
						visible: false,
						index: index
					}
					$scope.steps.push(step);

					if(index != 0) {
						$element.hide();
					}

					//console.log($scope.steps);

					
				},
				post: function postLink($scope, $element, attrs, controller) {
					
				}
			}
		}	
	}
}])
.directive('stepNav', [
function() {
	return {
		restrict: 'E',
		compile: function compile(tElement, tAttrs, transclude) {
			return {
				pre: function preLink($scope, $element, attrs, controller) {
					
				},
				post: function postLink($scope, $element, attrs, controller) {
					
				}
	    	}
		}
	}
}
])
.directive('stepNavItem', [
	function() {
		return {
		restrict: 'E',
		compile: function compile(tElement, tAttrs, transclude) {
			return {
				pre: function preLink($scope, $element, attrs, controller) {
					
				},
				post: function postLink($scope, $element, attrs, controller) {
					
				}
	    	}
		}
	}
	}
]);