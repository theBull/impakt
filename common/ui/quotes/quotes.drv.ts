/// <reference path='../ui.mdl.ts' />

impakt.common.ui.controller('quotes.ctrl', [
'$scope',
'$interval',
'_quotes',
function(
	$scope: any,
	$interval: any,
	_quotes: any
) {

	$scope.$element;
	$scope.quote = _quotes.getRandomQuote();

	$interval(function() {
		$scope.quote = _quotes.getRandomQuote();
	}, 10000);

}])
.directive('quotes', [
function() {
	return {
		restrict: 'E',
		templateUrl: 'common/ui/quotes/quotes.tpl.html',
		transclude: true,
		replace: true,
		controller: 'quotes.ctrl',
		link: function($scope, $element, attrs) {
			$scope.$element = $element;
		}
	}
}]);