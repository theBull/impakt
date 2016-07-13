/// <reference path='../ui.mdl.ts' />

impakt.common.ui.controller('associationInput.ctrl', [
'$scope',
'$rootScope',
'_associations',
function(
	$scope: any,
	$rootScope: any,
	_associations: any
) {

	$scope.associations;
	$scope.key;
	$scope.possibleAssociations = new Common.Models.ActionableCollection();
	$scope.associatedEntities = new Common.Models.ActionableCollection();
	$scope.possibleAssociationsListVisible = false;
	$scope.selectedPossibleAssociationIndex = 0;
	$scope.selectedPossibleAssociation = null;
	$scope.search = {
		text: ''
	};

	let associationsUpdateListener = $rootScope.$on('associations-updated', function(e: any) {
		$scope.associations = _associations.getAssociated($scope.entity);
		$scope.initialize();
	});

	let createEntityListener = $rootScope.$on('create-entity', function(e: any, entity: Common.Interfaces.IActionable) {
		$scope.initialize();
	});

	$scope.$watch('search', function(newVal: any, oldVal: any) {
		$scope.possibleAssociationsListVisible = newVal.text.length > 0;
	}, true);

	$scope.$on('$destroy', function() {
		associationsUpdateListener();
		createEntityListener();
	});

	$scope.initialize = function() {
		$scope.possibleAssociations = _associations.getContextDataByKey($scope.key);

		// remove any possible associations from the list if they already exist in the
		// associations collection, to prevent adding a duplicate association and to
		// just not suck in general...
		if (Common.Utilities.isNotNullOrUndefined($scope.associations)) {
			$scope.associatedEntities = $scope.associations[$scope.key];
			if (Common.Utilities.isNotNullOrUndefined($scope.associatedEntities)) {
				$scope.associatedEntities.forEach(function(associated: Common.Interfaces.IAssociable, index: number) {
					$scope.possibleAssociations.remove(associated.guid, false);
				});
			}
		}
	}


	$scope.addAssociation = function(toEntity: Common.Interfaces.IAssociable): void {
		_checkEntities(toEntity);

		_associations.createAssociation($scope.entity, toEntity).then(function() {			
			$scope.selectedPossibleAssociation = null;
			$scope.search.text = '';
		}, function(err) {
			$scope.search.text = '';
		});
	}

	$scope.removeAssociation = function(toEntity: Common.Interfaces.IAssociable): void {
		_checkEntities(toEntity);

		_associations.deleteAssociation($scope.entity, toEntity).then(function() {
			$scope.search.text = '';
		}, function(err) {
			$scope.search.text = '';
		});	
	}

	$scope.addSelectedPossibleAssociation = function() { 
		if (Common.Utilities.isNullOrUndefined($scope.selectedPossibleAssociation))
			return;

		$scope.addAssociation($scope.selectedPossibleAssociation);
		$scope.selectedPossibleAssociation = null;
		$scope.hidePossibleAssociationsList();
	}

	$scope.hidePossibleAssociationsList = function() {
		$scope.selectedPossibleAssociationIndex = 0;
		$scope.possibleAssociationsListVisible = false;
	}

	$scope.showPossibleAssociationsList = function() {
		$scope.possibleAssociationsListVisible = true;
		$scope.hoverInitialPossibleAssociation();
	}

	$scope.hoverInitialPossibleAssociation = function() {
		if (Common.Utilities.isNullOrUndefined($scope.possibleAssociations))
			return;

		$scope.selectedPossibleAssociationIndex = 0;
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
		if ($scope.selectedPossibleAssociationIndex < size - 1) {
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

	$scope.getController = function() {
		return $scope;
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

				$scope.initialize();

				let $input = $element.find('.associations-input-text');
				if(Common.Utilities.isNotNullOrUndefined($input)) {
					$input.keyup(function(e: any) {
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
			require: '^associationInput',
			templateUrl: 'common/ui/association-input/association-candidate-item.tpl.html',
			transclude: true,
			replace: false,
			link: function($scope: any, $element: any, attrs: any, controller: any) {
				
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