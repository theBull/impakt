/// <reference path='./team-personnel.mdl.ts' />

impakt.team.personnel.controller('impakt.team.personnel.ctrl', [
	'$scope',
	'_team',
	function($scope: any, _team: any) {
		console.debug('impakt.team.personnel.ctrl');

		$scope.personnelCollection;
		$scope.personnel;
		$scope.selectedPersonnel;
		$scope.unitTypes = Team.Models.UnitType.getUnitTypes();
		let positionDefault = new Team.Models.PositionDefault();
		$scope.positionOptions;
		$scope.createNew = false;
		$scope.creating = false;

		function init() {
			_team.initialize();
			
			$scope.personnelCollection = _team.personnel;
			$scope.personnel = _team.personnel.getOne() ||
				new Team.Models.Personnel(Team.Enums.UnitTypes.Other);
			$scope.selectedPersonnel = {
				guid: $scope.personnel.guid,
				unitType: $scope.personnel.unitType.toString()
			};
			$scope.positionOptions = positionDefault.getByUnitType(
				$scope.personnel.unitType
			);
		}

		$scope.cancelCreate = function() {
			$scope.creating = false;
		}

		$scope.createPersonnel = function() {
			$scope.personnel = new Team.Models.Personnel(Team.Enums.UnitTypes.Other);
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
				$scope.selectedPersonnel.unitType = $scope.personnel.unitType.toString();
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
			let updated = impakt.context.Team.positionDefaults.switchPosition(
				position,
				position.positionListValue
			);
			console.log(position, updated);
			$scope.personnel.positions.replace(position.guid, updated);
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

		init();
	}
])