/// <reference path='./playbook-browser.mdl.ts' />

impakt.playbook.browser.controller('playbook.browser.ctrl', 
['$scope', '__modals', '_playbookBrowser', 
function($scope: any, __modals: any, _playbookBrowser: any) {

	$scope.isCollapsed = _playbookBrowser.isCollapsed;
	$scope.unitTypes = impakt.context.Playbook.unitTypes;
	$scope.unitTypesEnum = impakt.context.Playbook.unitTypesEnum;
	$scope.playbooks = impakt.context.Playbook.playbooks;
	$scope.selectedUnitType = null;
	$scope.selectedPlaybook = null;
	$scope.formations = impakt.context.Playbook.formations;
	$scope.associatedFormations = new Playbook.Models.FormationCollection();

	_playbookBrowser.onready(function() {
		console.log($scope.playbookData);

	});

	$scope.selectUnitType = function(unitType: Playbook.Models.UnitType) {
		console.log('selected unit type', unitType.name, unitType);
		$scope.selectedUnitType = unitType;
	}
	$scope.selectPlaybook = function(playbook: Playbook.Models.PlaybookModel) {
		console.log('selected playbook', playbook);
		$scope.selectedPlaybook = playbook;
		$scope.formations.forEach(
			function(formation, index) {
				if(formation.associated.playbooks.indexOf(
					$scope.selectedPlaybook.guid) > -1) {
					$scope.associatedFormations.add(formation.guid, formation);
				}	
			});
	}

	$scope.getPlaybook = function(playbookKey) {
		_playbookBrowser.getPlaybook(playbookKey);
	}
	$scope.refreshPlaybook = function(playbookKey) {
		_playbookBrowser.refreshPlaybook(playbookKey);
	}

	$scope.getPlaybooks = function() {
		_playbookBrowser.getPlaybooks();
	}

	$scope.createPlaybook = function() {
		console.log('create playbook');
		let modalInstance = __modals.open(
			'', 
			'modules/playbook/modals/create-playbook/create-playbook.tpl.html', 
			'playbook.modals.createPlaybook.ctrl', 
			{}
		);

		modalInstance.result.then(function(createdPlaybook) {
			console.log(createdPlaybook);
		}, function(results) {
			console.log('dismissed');
		});
	}

	$scope.deletePlaybook = function(playbook) {
		console.log('delete playbook');
		let modalInstance = __modals.open(
			'',
			'modules/playbook/modals/delete-playbook/delete-playbook.tpl.html',
			'playbook.modals.deletePlaybook.ctrl',
			{ 
				playbook: function() { 
					return playbook; 
				} 
			}
		);

		modalInstance.result.then(function(results) {
			console.log(results);			
		}, function(results) {
			console.log('dismissed');
		});
	}

	$scope.getFormations = function(playbook) {
		_playbookBrowser.getFormations(playbook);
	}

	$scope.createFormation = function() {

		let modalInstance = __modals.open(
			'',
			'modules/playbook/modals/create-formation/create-formation.tpl.html',
			'playbook.modals.createFormation.ctrl', 
			{
				playbook: function() {
					return $scope.selectedPlaybook;
				},
				unitType: function() {
					return $scope.selectedUnitType;
				}
			}
		);

		modalInstance.result.then(function(createdFormation) {
			$scope.associatedFormations.add(createdFormation.guid, createdFormation);
		}, function(results) {
			console.log('dismissed');
		});
	}

	$scope.deleteFormation = function(formation) {
		console.log('delete formation');
		let modalInstance = __modals.open(
			'',
			'modules/playbook/modals/delete-formation/delete-formation.tpl.html',
			'playbook.modals.deleteFormation.ctrl',
			{
				formation: function() {
					return formation;
				}
			}
		);

		modalInstance.result.then(function(results) {
			$scope.associatedFormations.remove(formation.guid);
		}, function(results) {
			console.log('dismissed');
		});
	}

	$scope.editFormation = function(formation) {
		console.log('open for editing', formation);
		formation.active = !formation.active;
		_playbookBrowser.editFormation(formation);
	}

	$scope.createSet = function(formation) {
		console.log('create set', formation.key);

		let modalInstance = __modals.open(
			'',
			'modules/playbook/modals/create-set/create-set.tpl.html',
			'playbook.modals.createSet.ctrl',
			{
				formation: function() {
					return formation;
				}
			}
		);

		modalInstance.result.then(function(createdSet) {
			console.log(createdSet);
		}, function(results) {
			console.log('dismissed');
		});
	}

	$scope.deleteSet = function(formation, set) {
		console.log('delete set');
		let modalInstance = __modals.open(
			'',
			'modules/playbook/modals/delete-set/delete-set.tpl.html',
			'playbook.modals.deleteSet.ctrl',
			{
				set: function() {
					return set;
				},
				formation: function() {
					return formation;
				}
			}
		);

		modalInstance.result.then(function(results) {
			console.log(results);
		}, function(results) {
			console.log('dismissed');
		});
	}

}]);