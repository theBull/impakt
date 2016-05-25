/// <reference path='../playbook-modals.mdl.ts' />
 
impakt.playbook.modals.controller('playbook.modals.createScenario.ctrl', [
'$scope', 
'$uibModalInstance', 
'_associations',
'_playbook',
function(
	$scope: any, 
	$uibModalInstance: any, 
	_associations: any,
	_playbook: any
) {

	$scope.newScenario = new Common.Models.Scenario();
	$scope.playbooks = impakt.context.Playbook.playbooks;
	$scope.plays = impakt.context.Playbook.plays;

	$scope.selectedPlaybook = $scope.playbooks.first();
	$scope.selectedPrimaryPlay = null;
	$scope.selectedOpponentPlay = null;
	
	// Intialize new Scenario with data
	// TODO @theBull

	// Add the new scenario onto the creation context, to access from
	// other parts of the application
	impakt.context.Playbook.creation.scenarios.add($scope.newScenario);

	$scope.selectPlaybook = function(playbook: Common.Models.PlaybookModel) {
		$scope.newPlay.setPlaybook($scope.playbooks.get(playbook.guid));
	}

	$scope.selectPrimaryPlay = function(play: Common.Interfaces.IPlay) {
		_playbook.setPlayAssociations($scope.selectedPrimaryPlay);
		$scope.newScenario.setPlayPrimary($scope.selectedPrimaryPlay);
	}

	$scope.selectOpponentPlay = function(play: Common.Interfaces.IPlay) {
		_playbook.setPlayAssociations($scope.selectedOpponentPlay);
		$scope.newScenario.setPlayOpponent($scope.selectedOpponentPlay);
	}

	$scope.ok = function () {
				
		_playbook.createScenario($scope.newScenario)
		.then(function(createdScenario: Common.Models.Scenario) {
			_associations.createAssociations(createdScenario, [
				$scope.selectedPlaybook,
				$scope.selectedPrimaryPlay,
				$scope.selectedOpponentPlay
			]);
			removeScenarioFromCreationContext();
			$uibModalInstance.close(createdScenario);
		}, function(err) {
			removeScenarioFromCreationContext();
			console.error(err);
			$uibModalInstance.close(err);
		});
		
	};

	$scope.cancel = function () {
		removeScenarioFromCreationContext();
		$uibModalInstance.dismiss();
	};

	function removeScenarioFromCreationContext() {
		// Remove the scenario from the creation context
		// after creating the new scenario or cancelling
		if(Common.Utilities.isNotNullOrUndefined($scope.newScenario))
			impakt.context.Playbook.creation.scenarios.remove($scope.newScenario.guid);
	}
}]);