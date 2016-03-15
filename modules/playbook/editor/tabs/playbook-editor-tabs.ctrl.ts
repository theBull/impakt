/// <reference path='./playbook-editor-tabs.mdl.ts' />
/// <reference path='../../models/field/Canvas.ts' />
/// <reference path='../../../../common/common.ts' />
/// <reference path='../../playbook.ts' />

declare var impakt: any, angular: any;

impakt.playbook.editor.tabs.controller('playbook.editor.tabs.ctrl',
[
'$scope', 
'$stateParams',
'__modals',
'_base', 
'_playbookEditorTabs',
	function(
		$scope: any,
		$stateParams: any,
		__modals: any,
		_base: any, 
		_playbookEditorTabs: any) {

		
	$scope.play = $stateParams.data;

	console.debug('controller: playbook.editor.tabs', $stateParams.data);				

	this.component = new Common.Base.Component(
		'playbook.editor.tabs.ctrl', 
		Common.Base.ComponentType.Controller
	);
	function init(self) {
		_playbookEditorTabs.component.loadDependency(self.component);
	}

	// this creates a reference to the tabs within the service;
	// when it changes, $scope is automatically updated
	$scope.tabs = _playbookEditorTabs.getTabs();

	// open new tab by default
	//_playbookEditorTabs.new(0, true);

	$scope.new = function() {
		console.log('new editor');
		let modalInstance = __modals.open(
			'',
			'modules/playbook/modals/new-editor/new-editor.tpl.html',
			'playbook.modals.newEditor.ctrl',
			{
				data: function() {
					return 1;
				}
			}
		);

		modalInstance.result.then(function(data) {
			console.log(data);
		}, function(results) {
			console.log('dismissed');
		});
		
		//_playbookEditorTabs.new(0, true);
	}

	$scope.close = function(tab: Playbook.Models.Tab) {
		_playbookEditorTabs.close(tab);
	}

	$scope.activate = function(tab: Playbook.Models.Tab) {
		_playbookEditorTabs.activate(tab, true);
	}

	init(this);

}]);