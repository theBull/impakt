/// <reference path='./common-contextmenu.mdl.ts' />

declare var impakt: any;

impakt.common.contextmenu.controller('common.contextmenu.ctrl',
	['$scope', '__contextmenu',
		function($scope: any, __contextmenu: any) {
			console.log('common.contextmenu.ctrl');
			
			$scope.$element = {};
			$scope.template = '';
			$scope.left = 0;
			$scope.top = 0;
			$scope.width = 200;
			$scope.height = 200;
			$scope.guid = '';
			$scope.visible = true;

			$scope.remove = function() {
				console.log('remove contextmenu');
				$scope.$destroy();
				
				if($scope.$element) {
					$scope.$element.remove();
					$scope.$element = null;
				}
				$scope = null;
			}

			$scope.$on('$destroy', function() {
				// say goodbye to your controller here
				// release resources, cancel request...
				console.debug('destroying contextmenu controller');
			})

			__contextmenu.onclose(function(context: any) {
				$scope.remove();
			});

}]).directive('contextmenu',
['__contextmenu',
function(__contextmenu: any) {
console.debug('directive: contextmenu - register');
	return {
		controller: 'common.contextmenu.ctrl',
		restrict: 'E',
		templateUrl: 'common/contextmenu/common-contextmenu.tpl.html',
		scope: {
			guid: '@',
			template: '@',
			left: '@',
			top: '@'
		},
		link: function($scope: any, $element: any, attrs: any) {
			console.debug('directive: impakt.common.contextmenu - link');
			
		},
        compile: function($element: any, $attrs: any) {
            console.debug('directive: impakt.common.contextmenu - compile');

            return {
                pre: function($scope: any, element: any, attrs: any) {
                    console.debug('directive: impakt.common.contextmenu - pre');
                },
                post: function($scope: any, element: any, attrs: any) {
					console.debug('directive: impakt.common.contextmenu - post');

					$scope.$element = $element;
					console.log(
						'contextmenu left: ',
						attrs.left,
						'contextmenu top: ',
						attrs.top
					);
					__contextmenu.calculatePosition(
						parseInt(attrs.left),
						parseInt(attrs.top),
						$scope.$element
					);
                }
            }
        }
	};
}]);


