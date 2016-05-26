/// <reference path='../ui.mdl.ts' />

impakt.common.ui.controller('conferenceItem.ctrl', [
'$scope',
'_details',
'_league',
'_associations',
function(
	$scope: any,
	_details: any,
	_league: any,
	_associations: any
) {

	$scope.conference;
	$scope.element;

	$scope.getLeague = function(conference: League.Models.Conference) {
		return Common.Utilities.isNotNullOrUndefined(conference) ?
			(Common.Utilities.isNotNullOrUndefined(conference.league) ?
				conference.league.name : 'No league') :
			'No league';
	}

	/**
	 *
	 *	Item selection
	 * 
	 */
	$scope.toggleSelection = function(conference: League.Models.Conference) {
		_details.toggleSelection(conference);
	}
	
}]).directive('conferenceItem', [
'_associations',
function(
	_associations: any
) {
	/**
	 * conference-item directive
	 */
	return {
		restrict: 'E',
		controller: 'conferenceItem.ctrl',
		scope: {
			conference: '='
		},
		templateUrl: 'common/ui/conference-item/conference-item.tpl.html',
		transclude: true,
		replace: true,
		compile: function compile(tElement, tAttrs, transclude) {
			return {
				pre: function preLink($scope, $element, attrs, controller) { },
				post: function postLink($scope, $element, attrs, controller) {
					
					$scope.$element = $element;

					let associations = _associations.getAssociated($scope.conference);

					if(Common.Utilities.isNotNullOrUndefined(associations) &&
						associations.leagues.hasElements()) {
						$scope.conference.setLeague(associations.leagues.first());
					}
					
				}
			}
		}
	}
}]);