/// <reference path='./playbook-editor-details.mdl.ts' />

impakt.playbook.editor.details.controller('playbook.editor.details.ctrl', [
'$scope', 
'$timeout',
'_playbookModals', 
'_playbookEditorDetails', 
function(
	$scope: any, 
	$timeout: any,
	_playbookModals: any, 
	_playbookEditorDetails: any
) {
	
	$scope.canvas = _playbookEditorDetails.canvas;
	$scope.field;
	$scope.grid;
	$scope.scenario;
	$scope.layers;
	$scope.selectedElements;
	$scope.players;

	$scope.canvas.setListener('onready', function() {
		$scope.field = $scope.canvas.field;
		$scope.grid = $scope.canvas.grid;
		$scope.scenario = $scope.canvas.scenario;
		$scope.layers = $scope.field.layer.layers;
		$scope.selectedElements = $scope.field.selectedElements;
		$scope.players = $scope.field.primaryPlayers;

		// update scope when changes to field occur
		$scope.field.onModified(function() {
			$timeout(function() {
				$scope.$apply();
			}, 0);				
		});
	});	

	$scope.refreshPreview = function() {
		
	}

}]);