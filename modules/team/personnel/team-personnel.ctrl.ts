/// <reference path='./team-personnel.mdl.ts' />

impakt.team.personnel.controller('impakt.team.personnel.ctrl', [
	'$scope',
	'_team',
	function($scope: any, _team: any) {
		console.debug('impakt.team.personnel.ctrl');

		$scope.personnelCollection = _team.personnel;
		$scope.personnel = _team.personnel.getOne() || new Playbook.Models.Personnel();
		$scope.selectedPersonnel = { 
			guid: $scope.personnel.guid,
			unitType: $scope.personnel.unitType
		};
		$scope.unitTypes = Playbook.Models.UnitType.getUnitTypes();
		let positionDefault = new Playbook.Models.PositionDefault();
		$scope.positionOptions = positionDefault.getByUnitType(
			$scope.personnel.unitType
		);
		$scope.createNew = false;
		$scope.creating = false;

		$scope.cancelCreate = function() {
			$scope.creating = false;
		}

		$scope.createPersonnel = function() {
			$scope.personnel = new Playbook.Models.Personnel();
			$scope.creating = true;
			$scope.selectedPersonnel.unitType = $scope.personnel.unitType;
			$scope.createNew = true;
		}

		$scope.selectPersonnel = function() {
			$scope.createNew = false;
			console.log($scope.selectedPersonnel.guid);
			if ($scope.selectedPersonnel.guid) {
				$scope.personnel = null;
				$scope.personnel = $scope.personnelCollection.get($scope.selectedPersonnel.guid);
				$scope.selectedPersonnel.unitType = $scope.personnel.unitType;
				$scope.positionOptions = positionDefault.getByUnitType($scope.personnel.unitType);
			}
		}

		$scope.selectUnitType = function() {
			$scope.personnel.setUnitType(parseInt($scope.selectedPersonnel.unitType));
			$scope.positionOptions = positionDefault.getByUnitType(
				$scope.personnel.unitType
			);
		}

		$scope.update = function(position, index) {
			let updated = impakt.context.Playbook.positionDefaults.switchPosition(
				position,
				position.positionListValue
			);
			console.log(position, updated);
			$scope.personnel.positions.replace(position.guid, updated.guid, updated);
		}

		$scope.save = function() {
			console.log($scope.personnel);
			_team.savePersonnel($scope.personnel, $scope.createNew).then(function(results) {
				console.log(results);
			}, function(err){
				console.error(err);
			});
		}

		$scope.deletePersonnel = function(personnelItem) {
			console.log('deleting personnel', personnelItem);
			_team.deletePersonnel(personnelItem).then(function(results) {
				console.log(results);
			}, function(err) {
				console.error(err);
			});
		}
	}
])