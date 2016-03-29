App.controller('playbookBrowserController', 
['$scope', '$log', '$location', function($scope, $log, $location) {
	
	$log.log('playbook browser controller', 'id:', $location.search().id);
	$scope.playbookId = $location.search().id;
	$scope.playbookData = [];

	$.getJSON('/playbook', function(data) {
		console.log('mockjax:', data);
		
		$scope.playbookData = data

		$scope.$apply();
	});

}]);