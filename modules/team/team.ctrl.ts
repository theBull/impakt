/// <reference path='./team.mdl.ts' />

impakt.team.controller('team.ctrl', 
['$scope', '_team', 
function($scope: any, _team: any) {

	$scope.title = 'Team Management';
	$scope.tabs = {
		personnel: {
			title: 'Personnel groups',
			active: true,
			src: "modules/team/personnel/team-personnel.tpl.html"
		},
		teams: {
			title: 'My teams',
			active: false,
			src: 'modules/team/main/team-main.tpl.html'
		},
		unitTypes: {
			title: 'Unit types',
			active: false,
			src: "modules/team/unit-types/team-unit-types.tpl.html"
		}
	}

	$scope.activate = function(tab) {
		for(let key in $scope.tabs) {
			let obj = $scope.tabs[key];
			if (obj.active)
				obj.active = false;
		}
		tab.active = true;
	}

}]);