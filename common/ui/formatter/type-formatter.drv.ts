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
		// i.e. "['Playbook', 'Editor', 'EditorTypes']"
		let namespaceComponents = $scope.type.split('.');

		// Drill down into namespace -> window['Playbook']['Editor']['EditorTypes']
		// returns enum object
		let namespaceRoot = window;
		for (let i = 0; i < namespaceComponents.length; i++) {
			if (namespaceComponents[i]) {
				// Follow the namespace path down to the node object
				// window['Playbook']...
				// window['Playbook']['Editor']...
				// window['Playbook']['Editor']['EditorTypes']
				// node reached, namespaceRoot will finally point to the node object
				namespaceRoot = namespaceRoot[namespaceComponents[i]];
			}
		}

		// Get the enumeration list {enum: "Label"} || {number: string}
		let enumList = Common.Utilities.convertEnumToList(namespaceRoot);
		if (enumList) {
			// if it has values, get the Label string for the enum
			// and append it inside of the directive element
			let enumLabel = enumList[$scope.value];
			if (enumLabel) {
				$element.html(enumLabel);
			} else {
				throw new Error('type-formatter directive: \
						Something went wrong when trying to find the label for the given enum \
						"' + $scope.value + '" => "' + enumLabel + '"');
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