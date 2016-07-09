/// <reference path='../ui.mdl.ts' />

/**
 * DESCRIPTION:
 * will take the enumerated "value" and the
 * fully-namespaced path to the enumeration object aka "type"
 * and will format the enumerated value as a string label 
 * mapped to that enumerated value.
 *
 * I.e. 
 * type: Team.Enums.UnitTypes
 * value: 3
 * result: "Offense"
 * 
 * REQUIRED:
 * type: Namespaced location of enum "Playbook.Enums.EditorTypes"
 * value: Actual enumerated value
 */
impakt.common.ui.controller('typeFormatter.ctrl', [
'$scope', function($scope: any) {

	$scope.parseValue = function($element) {
		let namespaceRoot = Common.Utilities.parseEnumFromString($scope.type);

		// Get the enumeration list {enum: "Label"} || {number: string}
		let enumList = Common.Utilities.convertEnumToList(namespaceRoot);
		if (enumList) {
			// if it has values, get the Label string for the enum
			// and append it inside of the directive element
			let enumLabel = enumList[$scope.value];
			if (enumLabel) {
				$element.html(enumLabel);
			}
		}
	}

}]).directive('typeFormatter', [function() {
	return {
		restrict: 'E',
		controller: 'typeFormatter.ctrl',
		scope: {
			'value': '=',
			'type': '@'
		},
		link: function($scope, $element, attrs) {

			if (!attrs.type) {
				throw new Error('type-formatter directive: \
					A valid "type" attribute must be present on the element, \
					which is the fully namespaced type of the enum to evaluate.');
			}
			if (!attrs.value) {
				throw new Error('type-formatter directive: \
					A valid "value" attribute must be present on the element, \
					which is the enum value to retrieve the string for.')
			}

			$scope.parseValue($element);
			$scope.$watch('value', function(oldVal, newVal) {
				$scope.parseValue($element);
			});
		}
	}
}]);