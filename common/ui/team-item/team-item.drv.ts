/// <reference path='../ui.mdl.ts' />

impakt.common.ui.controller('teamItem.ctrl', [
'$scope',
'$state',
'_details',
'_league',
'_associations',
function(
	$scope: any,
	$state: any,
	_details: any,
	_league: any,
	_associations: any
) {

	$scope.team;
	$scope.element;

	$scope.getConference = function(team: Team.Models.TeamModel) {
		return Common.Utilities.isNotNullOrUndefined(team) ?
			(Common.Utilities.isNotNullOrUndefined(team.division) ?
				team.division.name : 'No division') :
			'No division';
	}

	/**
	 *
	 *	Item selection
	 * 
	 */
	$scope.toggleSelection = function(team: Team.Models.TeamModel) {
		if (!$state.is('league.drilldown.team')) {
			_details.selectedElements.deselectAll();
			_league.toTeamDrilldown(team);
		} else {
			_details.toggleSelection(team);
		}
	}
	
}]).directive('teamItem', [
'_associations',
function(
	_associations: any
) {
	/**
	 * team-item directive
	 */
	return {
		restrict: 'E',
		controller: 'teamItem.ctrl',
		scope: {
			team: '='
		},
		templateUrl: 'common/ui/team-item/team-item.tpl.html',
		transclude: true,
		replace: true,
		compile: function compile(tElement, tAttrs, transclude) {
			return {
				pre: function preLink($scope, $element, attrs, controller) { },
				post: function postLink($scope, $element, attrs, controller) {
					
					$scope.$element = $element;

					let associations = _associations.getAssociated($scope.team);

					if(Common.Utilities.isNotNullOrUndefined(associations) &&
						associations.divisions.hasElements()) {
						$scope.team.setDivision(associations.divisions.first());
					}
					
				}
			}
		}
	}
}]);