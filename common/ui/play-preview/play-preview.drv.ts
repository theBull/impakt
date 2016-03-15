/// <reference path='../ui.mdl.ts' />

impakt.common.ui.controller('playPreview.ctrl', [
'$scope', function($scope: any) {

	$scope.previewCanvas;
	$scope.play;
	$scope.showRefresh = false;
	$scope.guid = '';
	$scope.$element;

	$scope.refresh = function() {
		if (!$scope.play)
			throw new Error('play-preview refresh(): Play is null or undefined');
		if (!$scope.previewCanvas)
			throw new Error('play-preview refresh(): PreviewCanvas is null or undefined');
		if (!$scope.$element)
			throw new Error('play-preview refresh(): $element is null or undefined');
		
		$scope.$element.find('svg').show();
		$scope.previewCanvas.refresh();
		$scope.play.png = $scope.previewCanvas.exportToPng();
		$scope.$element.find('svg').hide();		
	}
	
}]).directive('playPreview', [
'$compile',
'$timeout',
'_playPreview',
function(
	$compile: any, 
	$timeout: any,
	_playPreview: any
) {
	return {
		restrict: 'E',
		controller: 'playPreview.ctrl',

		/**
		 * play-preview directive renders a PNG with the given
		 * play or formation* data. 
		 *
		 * TODO @theBull - *handle formations as well
		 * 
		 * @param {[type]} $scope   [description]
		 * @param {[type]} $element [description]
		 * @param {[type]} attrs    [description]
		 */
		template: "<div class='positionRelative'>\
					<div class='right0 top1 height2 width2'\
						ng-show='showRefresh'>\
						<span class='glyphicon glyphicon-refresh \
							pointer font-white-hover' \
							title='Refresh preview'\
							ng-click='refresh()'>\
						</span>\
					</div>\
					<img ng-src='{{play.png}}' />\
				</div>",
		transclude: true,
		replace: true,
		link: function($scope, $element, attrs) {

			$timeout(function() {

				$scope.$element = $element;
				// retrieve play data
				$scope.guid = attrs.guid;
				$scope.showRefresh = $element.hasClass('play-preview-refresh');

				// play MAY be only a temporary play used for editing a formation;
				// in which case, the temporary play should have been added to
				// the editor context...so check there...
				// ...if it's not there, check the creation context to see if
				// it's a play that's currently being created
				$scope.play = impakt.context.Playbook.plays.get($scope.guid) ||
					impakt.context.Playbook.editor.plays.get($scope.guid) ||
					impakt.context.Playbook.creation.plays.get($scope.guid);

				// if there's no play at this point, there's a problem
				if(!$scope.play) {
					throw new Error('play-preview link(): Unable to find play');
				}

				// create a previewCanvas to handle preview creation. Creating
				// a previewCanvas will insert a SVG into the <play-preview/> element
				// after the intialization phase.
				$scope.previewCanvas = new Playbook.Models.PreviewCanvas($scope.play, null);
				$scope.previewCanvas.initialize($element);
				
				if(!$scope.previewCanvas)
					throw new Error('play-preview link(): Creation of previewCanvas failed');

				// if the play has an existing png, skip the previewCanvas creation
				// step.
				if($scope.play.png == null) {
					$scope.refresh();
				}

				$scope.$element.find('svg').hide();

				$scope.play.onModified(function() {
					console.log('play-preview play.onModified(): refreshing preview');
					$scope.refresh();
				});	
			});
		}
	}
}]);