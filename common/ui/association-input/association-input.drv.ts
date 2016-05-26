/// <reference path='../ui.mdl.ts' />

impakt.common.ui.controller('associationInput.ctrl', [
'$scope',
'_associations',
function(
	$scope: any,
	_associations: any
) {

	$scope.possibleAssociations = new Common.Models.ActionableCollection();
	$scope.associatedEntities = new Common.Models.ActionableCollection();
	$scope.possibleAssociationsListVisible = false;
	$scope.selectedPossibleAssociationIndex = 0;
	$scope.selectedPossibleAssociation = null;
	$scope.search = {
		text: ''
	};

	$scope.$watch('search', function(newVal: any, oldVal: any) {
		$scope.possibleAssociationsListVisible = newVal.text.length > 0;
	}, true);

	$scope.addAssociation = function(toEntity: Common.Interfaces.IAssociable): void {
		_checkEntities(toEntity);

		_associations.createAssociation($scope.entity, toEntity).then(function() {
			// we need to remove the newly added entity from the list of possible
			// associations...
			let newlyAssociated = $scope.possibleAssociations.remove(toEntity.guid);
			$scope.selectedPossibleAssociation = null;

			if(Common.Utilities.isNotNullOrUndefined(newlyAssociated)) {
				// ...but once we remove the newly added entity, we want to keep it some where
				// in case we remove the entity's association and want it to reappear in the
				// list of possible associations...
				$scope.associatedEntities.add(newlyAssociated);
			}

			$scope.search.text = '';

		}, function(err) {
			$scope.search.text = '';
		});
	}

	$scope.removeAssociation = function(toEntity: Common.Interfaces.IAssociable): void {
		_checkEntities(toEntity);

		_associations.deleteAssociation($scope.entity, toEntity).then(function() {
			// ...we just deleted an association
			let removedAssociation = $scope.associatedEntities.remove(toEntity.guid);

			if (Common.Utilities.isNotNullOrUndefined(removedAssociation)) {
				// ...but once we remove the newly added entity, we want to keep it some where
				// in case we remove the entity's association and want it to reappear in the
				// list of possible associations...
				$scope.possibleAssociations.add(removedAssociation);
			}

			$scope.search.text = '';
		}, function(err) {
			$scope.search.text = '';
		});	
	}

	$scope.addSelectedPossibleAssociation = function() { 
		if (Common.Utilities.isNullOrUndefined($scope.selectedPossibleAssociation))
			return;

		$scope.addAssociation($scope.selectedPossibleAssociation);

		$scope.hidePossibleAssociationsList();
	}

	$scope.hidePossibleAssociationsList = function() {
		$scope.selectedPossibleAssociationIndex = 0;
		$scope.possibleAssociationsListVisible = false;
		$scope.selectedPossibleAssociation = null;
	}

	$scope.showPossibleAssociationsList = function() {
		$scope.selectedPossibleAssociationIndex = 0;
		$scope.possibleAssociationsListVisible = true;
		$scope.hoverInitialPossibleAssociation();
	}

	$scope.hoverInitialPossibleAssociation = function() {
		if (Common.Utilities.isNullOrUndefined($scope.possibleAssociations))
			return;

		let size = $scope.possibleAssociations.size();
		if(size > 0) {
			$scope.selectedPossibleAssociation = $scope.possibleAssociations.first();
			if (Common.Utilities.isNotNullOrUndefined($scope.selectedPossibleAssociation)) {
				$scope.possibleAssociations.hoverIn($scope.selectedPossibleAssociation);
			}
		}
	}

	$scope.hoverNextPossibleAssociation = function() {
		if (Common.Utilities.isNullOrUndefined($scope.possibleAssociations))
			return;

		if (!$scope.possibleAssociationsListVisible) {
			$scope.showPossibleAssociationsList();
			return;
		}

		let size = $scope.possibleAssociations.size();
		if ($scope.selectedPossibleAssociationIndex < size - 2) {
			$scope.selectedPossibleAssociationIndex++;
			$scope.selectedPossibleAssociation = $scope.possibleAssociations.getIndex($scope.selectedPossibleAssociationIndex);
			if (Common.Utilities.isNotNullOrUndefined($scope.selectedPossibleAssociation)) {
				$scope.possibleAssociations.hoverIn($scope.selectedPossibleAssociation);
			}
		}
	}

	$scope.hoverPreviousPossibleAssociation = function() {
		if (Common.Utilities.isNullOrUndefined($scope.possibleAssociations))
			return;

		if ($scope.selectedPossibleAssociationIndex > 0) {
			$scope.selectedPossibleAssociationIndex--;
			$scope.selectedPossibleAssociation = $scope.possibleAssociations.getIndex($scope.selectedPossibleAssociationIndex);
			if (Common.Utilities.isNotNullOrUndefined($scope.selectedPossibleAssociation)) {
				$scope.possibleAssociations.hoverIn($scope.selectedPossibleAssociation);
			}
		} else {
			if($scope.possibleAssociationsListVisible)
				$scope.hidePossibleAssociationsList();
		}
	}

	function _checkEntities(toEntity: Common.Interfaces.IAssociable) {
		if (Common.Utilities.isNullOrUndefined($scope.entity))
			throw new Error('association-input addAssociation(): entity is null or undefined');

		if (Common.Utilities.isNullOrUndefined(toEntity))
			throw new Error('association-input addAssociation(): toEntity is null or undefined');	
	}

}])
.directive('associationInput', [
	'_associations',
	function(
		_associations: any
	) {
		return {
			restrict: 'E',
			controller: 'associationInput.ctrl',
			templateUrl: 'common/ui/association-input/association-input.tpl.html',
			transclude: true,
			replace: false,
			scope: {
				entity: '=',
				associations: '=',
				key: '@'
			},
			link: function($scope: any, $element: any, attrs: any) {
				if (Common.Utilities.isNullOrUndefined($scope.key))
					throw new Error('association-input link(): key is required and is null or undefined');

				$scope.possibleAssociations = _associations.getContextDataByKey($scope.key);

				// remove any possible associations from the list if they already exist in the
				// associations collection, to prevent adding a duplicate association and to
				// just not suck in general...
				if(Common.Utilities.isNotNullOrUndefined($scope.associations)) {
					$scope.associatedEntities = $scope.associations[$scope.key];
					if(Common.Utilities.isNotNullOrUndefined($scope.associatedEntities)) {
						$scope.associatedEntities.forEach(function(associated: Common.Interfaces.IAssociable, index: number) {
							$scope.possibleAssociations.remove(associated.guid);
						});
					}
				}

				let $input = $element.find('.associations-input-text');
				if(Common.Utilities.isNotNullOrUndefined($input)) {
					$input.focus(function(e: any) {
						$scope.showPossibleAssociationsList();
						$scope.$apply();
					});
					$input.blur(function(e: any) {
						$scope.hidePossibleAssociationsList();
						$scope.$apply();
					});
					$input.keyup(function(e: any) {
						console.log(e.keyCode);
						e.preventDefault();
						if(e.keyCode == Common.Input.Which.Esc) {
							$scope.possibleAssociationsListVisible = false;
						} else if(e.keyCode == Common.Input.Which.Up) {	
							$scope.hoverPreviousPossibleAssociation();
						} else if(e.keyCode == Common.Input.Which.Down) {
							$scope.hoverNextPossibleAssociation();
						} else if(e.keyCode == Common.Input.Which.Enter) {
							$scope.addSelectedPossibleAssociation();
						}
						$scope.$apply();
					});

					$scope.$on("$destroy", function() {
						$input.off('focus').off('blur').off('keyup)');
					});
				}
			}
		}
	}
])
.directive('associationCandidateItem', [
	function() {
		return {
			restrict: 'E',
			controller: 'associationInput.ctrl',
			templateUrl: 'common/ui/association-input/association-candidate-item.tpl.html',
			transclude: true,
			replace: false,
			link: function($scope: any, $element: any, attrs: any) {

			}
		}
	}
])
.directive('associationTag', [
	function() {
		return {
			restrict: 'E',
			controller: 'associationInput.ctrl',
			require: '^associationInput',
			templateUrl: 'common/ui/association-input/association-tag.tpl.html',
			transclude: true,
			replace: false,
			link: function($scope: any, $element: any, attrs: any) {

			}
		}
	}
]);