/// <reference path='../ui.mdl.ts' />

impakt.common.ui.directive('ngPlaceholder', [
	'$sce',
	function(
		$sce: any
	) {
		return {
			restrict: 'A',
			require: '?ngModel',
			scope: {
				ngPlaceholder: '@'
			},
			link: function($scope: any, $element: any, attrs: any, ngModel: any) {
				if(!$scope.ngPlaceholder || !attrs)
					return;

				if(attrs && attrs.hasOwnProperty('autofocus') && 
					(attrs['autofocus'] === undefined || Boolean(attrs['autofocus']) === true ||
					attrs['autofocus'] == '')) {
						$element.focus();
					}

				$element.focus(function() {
					if(!_isNgModelSet())
						_clear();

				}).blur(function() {
					if(!_isNgModelSet())
						_setPlaceholder();

				}).keyup(function(e: any) {
					if(e.keyCode == Common.Input.Which.Backspace) {
						if(!_isNgModelSet()) {
							_clear();
						}
					}
				});

				$scope.$on("$destroy", function() {
					$element.off('focus').off('blur').off('keyup');
				});

				function _clear() {
					$element.val('');
					_setNgModel('');
					$element.removeAttr('style');
				}

				function _setNgModel(val: string) {
					ngModel.$setViewValue(val);
				}

				function _setPlaceholder() {
					if (!_isNgModelSet()) {
						$element.css({
							color: 'rgba(181, 182, 183, 0.8)',
							'-webkit-text-fill-color': 'rgba(181, 182, 183, 0.8)',
							'font-style': 'italic'
						});
						$element.val($scope.ngPlaceholder);
					} else {
						$element.removeAttr('style');
					}
				}

				function _isNgModelSet(): boolean {
					return !isNaN(parseInt(ngModel.$viewValue)) || (
						Common.Utilities.isNotNullOrUndefined(ngModel.$viewValue) &&
						Common.Utilities.isNotEmptyString(ngModel.$viewValue)
					);
				}

				if(Common.Utilities.isNotNullOrUndefined(ngModel) &&
					Common.Utilities.isNotNullOrUndefined(attrs.ngModel)) {

					let modelValue = ngModel.$viewValue || null;

					$scope.$watch(attrs.ngModel, function(newVal: any, oldVal: any) {
						_setPlaceholder();
					}, true);

					if (Common.Utilities.isNullOrUndefined(modelValue)) {
						_setPlaceholder();
					} else {
						$element.removeClass('font-gray').addClass('font-white');
						// Specify how UI should be updated
						ngModel.$render = function() {
							$element.val($sce.getTrustedHtml(ngModel.$viewValue || ''));
						};
					}

				}

				
			}
		}
	}
]);