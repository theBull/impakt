///<reference path='./playbook-editor-canvas.mdl.ts' />

impakt.playbook.editor.canvas.controller('playbook.editor.canvas.ctrl', [
'$scope',
'$timeout',
'_playbookEditor',
function(
	$scope: any,
	$timeout: any,
	_playbookEditor: any
) {

	$scope.tab = _playbookEditor.getActiveTab();
	$scope.tabs = _playbookEditor.tabs;
	$scope.hasOpenTabs = _playbookEditor.hasTabs();

	// check if there are any open tabs; if not, hide the canvas and
	// clear the canvas data.
	if(Common.Utilities.isNotNullOrUndefined($scope.tab)) {
		$scope.tab.onclose(function() {
			$scope.hasOpenTabs = _playbookEditor.hasTabs();
		});

	}

	if(Common.Utilities.isNotNullOrUndefined($scope.tabs)) {
		$scope.tabs.onModified(function(tabs: Common.Models.TabCollection) {
			$scope.hasOpenTabs = tabs.hasElements();
		});
	}

}])
.directive('playbookEditorCanvas', 
	['$rootScope', 
	'$compile', 
	'$templateCache',
	'$timeout',
	'_contextmenu',
	'_playPreview',
	'_playbookEditor', 
	'_scrollable',
	function(
		$rootScope: any, 
		$compile: any, 
		$templateCache: any, 
		$timeout: any,
		_contextmenu: any,
		_playPreview: any,
		_playbookEditor: any,
		_scrollable: any
	) {
	console.debug('directive: impakt.playbook.editor.canvas - register');
	
	return {
		restrict: 'E',
		controller: '',
		link: function($scope: any, $element: any, attrs: any) {
			console.debug('directive: impakt.playbook.editor.canvas - link');

			let component = new Common.Base.Component(
				'playbookEditorCanvas', 
				Common.Base.ComponentType.Directive
			);

			$scope.canvas = _playbookEditor.canvas;

			// $timeout NOTE:
			// wrapping this step in a timeout due to a DOM rendering race.
			// The angular ng-show directive kicks in when activating/
			// deactivating the tabs, and the .col class (css-flex)
			// needs time itself to render to the appropriate size.
			// This timeout lets all of that finish before intializing
			// the canvas; the canvas requires an accurate $element height
			// value in order to get its proper dimensions.
			$timeout(function() {
				if ($scope.canvas) {

					$scope.canvas.setListener('onready', function() {

						// Scroll the viewport to be centered over the LOS
						let scrollTop = $scope.canvas.field.getLOSAbsolute()
							- ($element.height() / 2);
						$element.scrollTop(scrollTop);

						// Load up the scenario into the canvas
						_playbookEditor.refreshScenario();

					});

					$scope.canvas.initialize($element);

					// Listen for routenode contextmenu
					$scope.canvas.listener.listen(
						Playbook.Enums.Actions.RouteNodeContextmenu,
						function(data: Common.Models.ContextmenuData) {
							_contextmenu.open(data);
						}
					);

				}
			}, 0);

			_playbookEditor.component.loadDependency(component);
		}
	}

}]);

