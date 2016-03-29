

Impakt.App.controller('navigator.playbook.controller', 
['$scope', '$location', 'PlaybookService',
function($scope, $location, PlaybookService) {

	debug.log('browser playbook controller');

	$scope.playbookData = {};
	$scope.playbookDataLoaded = false;
	$scope.browserPlaybookView;


	// Main request for all playbooks
	PlaybookService.getAllPlaybooks(function(playbookResults) {
		$scope.playbookData = new kendo.data.HierarchicalDataSource({
			data: playbookResults
		});

		debug.log('playbook service: ', PlaybookService.playbooks);
		$scope.browserPlaybookView = 'views/browserPlaybook.html';
		$scope.$apply();
	});

	$scope.itemClick = function() {
		debug.log('click');
	}

	$scope.itemDblClick = function(item) {
		debug.log(item);
		var type = item.type;
		var id = item.id;
		var parentId = item.parentId;
		var query = {
			'view': '',
			'id': id,
			'parentId': parentId 
		}

		console.log(type, id, query);

		switch(type) {
			case 'Playbook':
				// open playbook browser view
				query['view'] = 'browser';
				$location.search().view != 'browser' && $location.search(query);
				break;
			case 'Play':
				// open play editor
				query['view'] = 'editor';
				$location.search().view != 'editor' && $location.search(query);
				break;
		}
	}

}]);

