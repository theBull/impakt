var playbookController = App.controller('playbookController', 
['$scope', '$log', '$location', 'PlaybookService', 
function($scope, $log, $location, PlaybookService) {

	debug.log('playbook controller');

	// Maintain a reference to the currently selected playbook.

	$scope.playbookViewParams = $location.search();

	$scope.playbookViews = ['browser', 'editor', 'plan'];
	$scope.playbookViewIncludes = {
		'browser': {
			view: 'views/playbookBrowser.html',
			isLoaded: false
		},
		'editor': {
			view: 'views/playbookEditor.html',
			isLoaded: false
		},
		'plan': {
			view: 'views/playbookPlan.html',
			isLoaded: false
		}
	}
	$scope.playbookView = getPlaybookView();

	console.log('playbook view: ', $scope.playbookView);

	function getPlaybookView() {
		var playbookViewName = $scope.playbookViewParams.view;
		var viewIndex = $scope.playbookViews.indexOf(playbookViewName);

		// Check whether the view has been created already and is
		// registered with the playbook service
		var playbookServiceView = PlaybookService.getPlaybookViews($scope.playbookViewParams.view);
		
		if(playbookServiceView) {
			// playbook view already exists;
			// do something
		} else {
			// instantiate new playbook view state fn([viewName, isKeepAlive])
			PlaybookService.addPlaybookView(playbookViewName, true);
		}

		console.log($scope.playbookViews[viewIndex]);

		return $scope.playbookViews[viewIndex];
	}

}]);