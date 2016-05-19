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
	$scope.playPrimary;
	$scope.playOpponent;
	$scope.layers;
	$scope.selected;
	$scope.players;

	$scope.canvas.onready(function() {
		$scope.paper = $scope.canvas.paper;
		$scope.field = $scope.paper.field;
		$scope.grid = $scope.paper.grid;
		$scope.playPrimary = $scope.canvas.playPrimary;
		$scope.playOpponent = $scope.canvas.playOpponent;
		$scope.layers = $scope.field.layers;
		$scope.selected = $scope.field.selected;
		$scope.players = $scope.field.players;

		// update scope when changes to field occur
		$scope.field.onModified(function() {
			$timeout(function() {
				$scope.$apply();
			}, 0);				
		});
	});	

	$scope.refreshPreview = function() {
		
	}

	$scope.deletePrimary = function(play: Common.Models.PlayPrimary) {
		if(play.editorType == Playbook.Enums.EditorTypes.Play) {
			_playbookModals.deletePlay(play).then(function() {
				_playbookEditorDetails.closeActiveTab();
			}, function(err) {

			});
		} else if(play.editorType == Playbook.Enums.EditorTypes.Formation) {
			_playbookModals.deleteFormation(play.formation).then(function() {
				_playbookEditorDetails.closeActiveTab();
			}, function(err) {
			
			});
		}
	}

}]);