/// <reference path='./contextmenu.mdl.ts' />

impakt.common.contextmenu.controller('common.contextmenu.ctrl',[
'$scope', 
'_contextmenu',
function(
	$scope: any, 
	_contextmenu: any
) {
	
	$scope.$contextmenuElement;
	$scope.contextmenuData = _contextmenu.contextmenuData;
	$scope.left = 0;
	$scope.top = 0;
	$scope.width = 200;
	$scope.height = 200;
	$scope.guid = '';
	$scope.contextmenuVisible = false;

	_contextmenu.onopen(function(data: Common.Models.ContextmenuData) {
		$scope.contextmenuData = data;
		$scope.contextmenuVisible = true;
		if (!$scope.$$phase) {
			$scope.$apply();
		}
		$scope.$contextmenuElement.offset({ top: data.pageY, left: data.pageX });
	});

	_contextmenu.onclose(function() {
		$scope.contextmenuData = null;
		$scope.contextmenuVisible = false;

		if (!$scope.$$phase) {
			$scope.$apply();
		}
	});

	$scope.open = function(data: Common.Interfaces.IContextual) {
		_contextmenu.open(data);
	}

	$scope.close = function() {
		_contextmenu.close();
	}

}]).directive('contextmenu',[
'_contextmenu',
function(_contextmenu: any) {
console.debug('directive: contextmenu - register');
	return {
		controller: 'common.contextmenu.ctrl',
		restrict: 'E',
		templateUrl: 'common/contextmenu/contextmenu.tpl.html',
		transclude: true,
		replace: true,
        link: function($scope: any, $element: any, attrs: any) {
			$scope.$contextmenuElement = $element;

			$(document).keyup(function(e: any) {
				if (e.which == Common.Input.Which.Esc) {
					$scope.close();
				}
			});
        }
	};
}])
.directive('enableContextmenu', [
'_contextmenu',
function(
	_contextmenu: any
) {
	return {
		restrict: 'A',
		scope: {
			entity: '='
		},
		link: function($scope: any, $element: any, attrs: any) {
			$element.mousedown(function(e: any) {
				if(e.which == Common.Input.Which.RightClick) {
					_contextmenu.open(
						new Common.Models.ContextmenuData($scope.entity, e.pageX, e.pageY)
					);
				}
			});
		}
	}
}]);


