/// <reference path='./playbook-editor-details.mdl.ts' />

impakt.playbook.editor.details.controller('playbook.editor.details.ctrl', 
['$scope', '_playbookEditorDetails', 
function($scope: any, _playbookEditorDetails: any) {
	
	$scope.canvas = _playbookEditorDetails.canvas;

	$scope.refreshPreview = function() {
		
	}

}]);