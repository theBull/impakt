/// <reference path='./playbook-editor-mode.mdl.ts' />

impakt.playbook.editor.mode.controller('playbook.editor.mode.ctrl',
[
'$scope',
'_playbookEditor',
function(
	$scope: any,
	_playbookEditor: any
) {

	$scope.canvas = _playbookEditor.canvas;

	$scope.canvas.setListener('onready', function() {
		$scope.cursorCoordinates = $scope.canvas.field.cursorCoordinates;

		$scope.canvas.field.onModified(function(field: Common.Interfaces.IField) {
			$scope.cursorCoordinates.x = field.cursorCoordinates.x;
			$scope.cursorCoordinates.y = field.cursorCoordinates.y;

			if(!$scope.$$phase)
				$scope.$apply();
		});
	});

}]);