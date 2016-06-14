/// <reference path='./playbook-browser.mdl.ts' />

impakt.playbook.browser.controller('playbook.browser.ctrl', [
'$scope',
'__context',
'_details',
'_associations',
'_playbook',
'_playbookModals',
function(
	$scope: any, 
	__context: any,
	_details: any,
	_associations: any,
	_playbook: any, 
	_playbookModals: any
) {
	
	$scope.editor = impakt.context.Playbook.editor;
	$scope.playbooks = impakt.context.Playbook.playbooks;

	$scope.test = $scope.playbooks.first();
	
	_details.selectedPlay = null;

	$scope.getEditorTypeClass = function(editorType: Playbook.Enums.EditorTypes) {
		return _playbook.getEditorTypeClass(editorType);
	}

	$scope.openEditor = function() {
		_playbook.toEditor();
	}

	$scope.createPlaybook = function() {
		_playbookModals.createPlaybook();
	}
	$scope.deletePlaybook = function(playbook: Common.Models.PlaybookModel) {
		_playbookModals.deletePlaybook(playbook).then(function(data) {
			// navigate back to the main browser view
			$scope.goToAll();
		}, function(err) {

		});
	}

	$scope.getAssociationsCountForPlaybook = function(playbook: Common.Models.PlaybookModel) {
		let associations = _associations.getAssociated(playbook);
		return associations.count();
	}

}]);