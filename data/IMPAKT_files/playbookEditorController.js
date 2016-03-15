var playbookEditorController = App.controller(
	'playbookEditorController', 
	['$scope', '$log', '$location', 'PlaybookService',
	function($scope, $log, $location, PlaybookService) {

		var itemId = $location.search().id;
		var parentId = $location.search().parentId;
		var CREATE_NEW_TAB_DEFAULT = true;
		var UNTITLED_LABEL = 'Untitled';

		//console.log('playbook editor controller', PlaybookService.editorTabs);

		$scope.tabCount = 1;
		$scope.activeTab = CREATE_NEW_TAB_DEFAULT ? getNewTab(0, true) : null;
		$scope.tabs = PlaybookService.editorTabs || [];
		$scope.playbookViewIncludes.editor.isLoaded = true;

		PlaybookService.getPlayById(itemId, function(playData) {
			//console.log('retrieved play data (ajax):', playData);
			$scope.activeTab = getNewTabFromData(playData, true)
			$scope.tabs.push($scope.activeTab);
			$scope.tabCount++;
			
			// persist editor tab data in playbook service
			PlaybookService.setEditorTabs($scope.tabs);

			$scope.$apply();
		});

		$scope.addTab = function() {
			//$log.log('new tab added');
			for(var i = 0; i < $scope.tabs.length; i++) {
				$scope.tabs[i].isActive = false;
			};

			//console.dir($scope.tabs);
			$scope.tabCount++;
			var count = '(' + $scope.tabCount + ')';
			
			var newTab = getNewTab(0, true);

			$scope.tabs.push(newTab);
			$scope.activeTab = newTab;

			// persist editor tab data in playbook service
			PlaybookService.setEditorTabs($scope.tabs);
		}

		$scope.removeTab = function(index) {
				
			// change the url to reflect the current active tab
			// if there are any tabs remaining.
			if($scope.tabs.length > 0) {
				var lastTabIndex = $scope.tabs.length - 1;
				switch(index) {
					case 0: 
						// first tab was removed, activate the second tab
						$scope.activeTab = $scope.tabs[0];
						$scope.tabs[0].isActive = true;
						break;
					case lastTabIndex: 
						// last tab was removed, active the last tab
						$scope.activeTab = $scope.tabs[lastTabIndex - 1]
						$scope.tabs[lastTabIndex - 1].isActive = true;
						break;
					default:
						// middle tab was removed, select the tab to the right
						$scope.activeTab = $scope.tabs[index + 1];
						$scope.tabs[index + 1].isActive = true;
						break;
				}

				// we've set the active tab, update the editor URL accordingly
				updateURL();
			} else {
				// we have no more tabs, don't set active
			}
			
			// finally, remove the tab from the array			
			$scope.tabs.splice(index, 1);

			// persist editor tab data in playbook service
			PlaybookService.setEditorTabs($scope.tabs);
		}

		$scope.clickTab = function(index) {
			for(var i = 0; i < $scope.tabs.length; i++) {
				if(i != index) {
					$scope.tabs[i].isActive = false;
				}
			}
			$scope.tabs[index].isActive = true;
			$scope.activeTab = $scope.tabs[index];
			updateURL();
		}

		function updateURL() {
			$location.search({
				view: 'editor',
				id: $scope.activeTab.id, 
				parentId: $scope.activeTab.parentId
			});
		}

		function getNewTab(i, isActive) {
			return {
				id: 0, // new play has id 0 to indicate it needs a new one assigned
				parentId: $scope.activeTab ? $scope.activeTab.parentId : 0, // TODO: do not allow play to be created w/o playbook? 
				title: UNTITLED_LABEL + ' (' + i + ')*',
				isActive: isActive,
				data: null,
				canvas: null
			};
		}

		function getNewTabFromData(data, isActive) {
			if(!data || data.id == 0) {
				console.error(); 
				return;
			}

			return {
				parentId: parentId,
				id: data ? data.id : 0, // we shouldn't hit this case - if we do, we have an error
				title: data && data.title ? data.title : UNTITLED_LABEL,
				isActive: isActive || false,
				data: data,
				canvas: null
			} 
		}

}]);
