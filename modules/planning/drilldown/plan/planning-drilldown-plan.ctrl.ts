/// <reference path='./planning-drilldown-plan.mdl.ts' />

impakt.planning.drilldown.plan.controller('planning.drilldown.plan.ctrl', [
'$scope', 
'$rootScope',
'_associations',
'_planning', 
'_planningModals',
function(
	$scope: any,
	$rootScope: any,
	_associations: any, 
	_planning: any, 
	_planningModals: any
) {

	$scope.plan = _planning.drilldown.plan;
	$scope.practicePlans = new Planning.Models.PracticePlanCollection();
	$scope.gamePlans = new Planning.Models.GamePlanCollection();
	$scope.scoutCards = new Planning.Models.ScoutCardCollection();
	
	let deletePracticePlanListener = $rootScope.$on('delete-practicePlan', function(e: any, practicePlan: Planning.Models.PracticePlan) {
		$scope.practicePlans.remove(practicePlan.guid);
	});
	
	let deleteGamePlanListener = $rootScope.$on('delete-gamePlan', function(e: any, gamePlan: Planning.Models.GamePlan) {
		$scope.gamePlans.remove(gamePlan.guid);
	});
	
	let deleteScoutCardListener = $rootScope.$on('delete-scoutCard', function(e: any, scoutCard: Planning.Models.ScoutCard) {
		$scope.scoutCard.remove(scoutCard.guid);
	});

	let associationsUpdatedListener = $rootScope.$on('associations-updated', function(e: any) {
		init();
	});

	$scope.$on('$destroy', function() {
		deletePracticePlanListener();
		deleteGamePlanListener();
		deleteScoutCardListener();
		associationsUpdatedListener();
	});

	function init() {
		let planAssociations = _associations.getAssociated($scope.plan);

		if (Common.Utilities.isNotNullOrUndefined(planAssociations)) {
			$scope.practicePlans = planAssociations.practicePlans;
			$scope.practicePlans.forEach(function(practicePlan: Planning.Models.PracticePlan, index: number) {
				practicePlan.setPlan($scope.plan);
			});

			$scope.gamePlans = planAssociations.gamePlans;
			$scope.gamePlans.forEach(function(gamePlan: Planning.Models.GamePlan, index: number) {
				gamePlan.setPlan($scope.plan);
			});

			$scope.scoutCards = planAssociations.scoutCards;
			$scope.scoutCards.forEach(function(scoutCard: Planning.Models.GamePlan, index: number) {
				scoutCard.setPlan($scope.plan);
			});
		}
	}

	$scope.createPracticePlan = function() {
		_planningModals.createPracticePlan($scope.plan)
		.then(function() {
			init();	
		});
	}

	$scope.createGamePlan = function() {
		_planningModals.createGamePlan($scope.plan)
		.then(function() {
			init();	
		});
	}

	$scope.createScoutCard = function() {
		_planningModals.createScoutCard($scope.plan)
		.then(function() {
			init();	
		});
	}

	init();

}]);