var playEditorController = App.controller('playEditorController', 
['$scope', '$log', '$location', 'PlaybookService', 
function($scope, $log, $location, PlaybookService) {

	$scope.editor; // same as $scope - prototypal inheritance
	$scope.parentTab; // will be initialized in view with ng-init
	$scope.playId = $location.search().id;

}]).directive('impaktCanvas', ['$log', function($log) {
	debug.log('impakt canvas directive');  

	function link($scope, $element, attrs) {

		var $canvasContainer = $element.find('.playbook-editor-canvas');
		var canvas = new Impakt.Playbook.Editor.Canvas(
		$canvasContainer[0], {
			playId: $scope.playId,
			title: $scope.parentTab.title
		});

		$scope.parentTab.canvas = canvas;
		debug.log('parentTab data:', $scope.parentTab.data);
		debug.log('canvas field:', canvas.field);

		// create players
		canvas.field.drawFromPlay($scope.parentTab.data);

	}

	return {
		link: link
	};
}]);