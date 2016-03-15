/// <reference path='./playbook-editor-tools.mdl.ts' />

// Inherits from playbookEditorController
impakt.playbook.editor.tools.controller('playbook.editor.tools.ctrl',
['$scope', '$rootScope', '_playbookEditorTools', 
function($scope: any, $rootScope: any, _playbookEditorTools: any) {
	console.debug('controller: playbook.editor.tools');

	this.component = new Common.Base.Component(
		'playbook.editor.tools.ctrl',
		Common.Base.ComponentType.Controller
	);
	function init(self) {
		_playbookEditorTools.component.loadDependency(self.component);
	}

	$scope.tools = _playbookEditorTools.tools;

	$scope.expanded = false;

	$scope.toolClick = function(tool: Playbook.Editor.Tool) {
		_playbookEditorTools.invoke(tool);
	}

	$rootScope.$on('playbook-editor-canvas.toggleMenu',
		function(e: any, data: any) {
			$scope.expanded = !$scope.expanded;
		});

	init(this);

}]);