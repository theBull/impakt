/// <reference path='../planning-modals.mdl.ts' />
 
impakt.planning.modals.controller('planning.modals.createPlan.ctrl', 
[
'$scope', 
'$uibModalInstance', 
'_associations',
'_planning',
'plan',
function(
	$scope: any, 
	$uibModalInstance: any, 
	_associations: any,
	_planning: any,
	plan: any
) {

	$scope.plans = impakt.context.Planning.plans;
	$scope.allGames = impakt.context.Season.games;
	$scope.games = new Season.Models.GameCollection();
	$scope.weeks = new Season.Models.WeekCollection();
	$scope.newPlan = new Planning.Models.Plan();
	$scope.seasons = impakt.context.Season.seasons;
	$scope.selectedSeason = null;
	$scope.selectedWeek = null;
	$scope.selectedGame = null;

	$scope.selectSeason = function() {
		if (Common.Utilities.isNullOrUndefined($scope.selectedSeason)) {
			$scope.selectedWeek = null;
			$scope.selectedGame = null;
			return;
		}

		$scope.weeks = $scope.selectedSeason.weeks;
		$scope.selectedWeek = $scope.weeks.first();
		$scope.selectWeek();
	}

	$scope.selectWeek = function() {
		if (Common.Utilities.isNullOrUndefined($scope.selectedWeek)) {
			$scope.selectedGame = null;
			return;
		}
	
		$scope.games.listen(false);
		$scope.games.empty();
		$scope.allGames.forEach(function(game: Season.Models.Game, index: number) {
			if($scope.selectedWeek.guid == game.weekGuid)
				$scope.games.add(game);
		});
		$scope.games.listen(true);
	}

	$scope.selectGame = function() {
		$scope.newPlan.setGame($scope.selectedGame);
	}

	$scope.updateDatetime = function() {
		// TODO @theBull
	}

	$scope.ok = function () {
		
		_planning.createPlan($scope.newPlan)
		.then(function(createdPlan: Planning.Models.Plan) {

			let planAssociations = [];

			if (Common.Utilities.isNotNullOrUndefined($scope.selectedGame))
				planAssociations.push($scope.selectedGame);
			
			_associations.createAssociations(createdPlan, planAssociations);
			removePlanFromCreationContext();

			$uibModalInstance.close(createdPlan);
		}, function(err) {
			removePlanFromCreationContext();
			console.error(err);
			$uibModalInstance.close(err);
		});
		
	};

	$scope.cancel = function() {
		removePlanFromCreationContext();
		$uibModalInstance.dismiss();
	};

	function removePlanFromCreationContext() {
		// Remove the plan from the creation context
		// after creating the new plan or cancelling
		if (Common.Utilities.isNotNullOrUndefined($scope.newPlan))
			impakt.context.Planning.creation.plans.remove($scope.newPlan.guid);
	}
}]);