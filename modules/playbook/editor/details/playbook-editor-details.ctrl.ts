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
	$scope.paper;
	$scope.field;
	$scope.grid;
	$scope.scenario;
	$scope.layers;
	$scope.selected;
	$scope.players;

	$scope.canvas.onready(function() {
		$scope.paper = $scope.canvas.paper;
		$scope.field = $scope.paper.field;
		$scope.grid = $scope.paper.grid;
		$scope.scenario = $scope.canvas.scenario;
		$scope.layers = $scope.field.layers;
		$scope.selected = $scope.field.selected;
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