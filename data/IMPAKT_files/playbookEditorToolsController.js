
// Inherits from playbookEditorController
var playbookEditorToolsController = App.controller('playbookEditorToolsController',
['$scope', '$modal', '$log', 'PlaybookService', function($scope, $modal, $log, PlaybookService) {
	debug.log('playbook editor tools controller');

	$scope.tools = [
		{
			tooltip: 'Add player',
			glyphicon: 'user',
			action: 'addPlayer'
		},
		{
			tooltip: 'Save',
			glyphicon: 'floppy-save',
			action: 'savePlay'
		},
		{
			tooltip: 'Other',
			glyphicon: 'add'
		},
		{
			tooltip: 'Some function',
			glyphicon: 'add'
		}
	];

	$scope.toolClick = function(tool) {
		switch(tool.action) {
			case 'addPlayer': 
				// TODO: implement
				debug.log($scope.activeTab);
				var newPlayer = new Impakt.Playbook.Models.Player($scope.activeTab.canvas);
				newPlayer.draw();
				break;
			case 'savePlay':
				var saveData = $scope.activeTab.canvas.field.getSaveData();
				saveData['parentId'] = $scope.activeTab.parentId;

				// var modalInstance = $modal.open({
				// 	templateUrl: 'savePlayModal.html',
				// 	controller: 'savePlayModalController',
				// 	resolve: {
				// 		items: function () {
				// 			return $scope.items;
				// 		}
				// 	}
				// });

				// modalInstance.result.then(function (selectedItem) {
				// 	$scope.selected = selectedItem;
				// }, function () {
				// 	$log.info('Modal dismissed at: ' + new Date());
				// });

				// PlaybookService.savePlay(saveData, function(results) {
				// 	console.log(results);
				// })
				break;
		}
	}

}]);