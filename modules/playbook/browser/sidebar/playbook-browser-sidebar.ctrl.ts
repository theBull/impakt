/// <reference path='./playbook-browser-sidebar.mdl.ts' />

impakt.playbook.browser.sidebar.controller('playbook.browser.sidebar.ctrl', [
'$scope',
'__router',
'_playbook',
'_playbookModals',
function($scope: any, __router: any, _playbook: any, _playbookModals: any) {

	let parent = 'playbook.browser.sidebar';
	__router.push(
		parent, [
			new Common.Models.Template(
				'playbook.browser.sidebar.unitTypes',
				'modules/playbook/browser/sidebar/unitTypes/unitTypes.tpl.html'
			),
			new Common.Models.Template(
				'playbook.browser.sidebar.playbooks',
				'modules/playbook/browser/sidebar/playbook/playbooks.tpl.html'
			),
			new Common.Models.Template(
				'playbook.browser.sidebar.associated',
				'modules/playbook/browser/sidebar/associated/associated.tpl.html'
			),
			new Common.Models.Template(
				'playbook.browser.sidebar.plays',
				'modules/playbook/browser/sidebar/play/plays.tpl.html'
			),
			new Common.Models.Template(
				'playbook.browser.sidebar.formations',
				'modules/playbook/browser/sidebar/formation/formations.tpl.html'
			)
		]);

	$scope.template = {};

	$scope.unitTypes = impakt.context.Team.unitTypes;
	$scope.plays = impakt.context.Playbook.plays;
	$scope.formations = impakt.context.Playbook.formations;

	$scope.goToUnitTypes = function() {
		$scope.template = __router.get(parent, 'playbook.browser.sidebar.unitTypes');
	}
	$scope.goToPlaybooks = function() {
		$scope.template = __router.get(parent, 'playbook.browser.sidebar.playbooks');
	}
	$scope.goToAssociated = function() {
		$scope.template = __router.get(parent, 'playbook.browser.sidebar.associated');
	}
	$scope.goToPlays = function() {
		$scope.template = __router.get(parent, 'playbook.browser.sidebar.plays');
	}
	$scope.goToFormations = function() {
		$scope.template = __router.get(parent, 'playbook.browser.sidebar.formations');
	}

	$scope.refreshPlays = function() {
		$scope.plays = impakt.context.Playbook.plays;
	}
	$scope.refreshFormations = function() {
		$scope.formations = impakt.context.Playbook.formations;
	}
	$scope.createPlay = function() {
		_playbookModals.createPlay();
	}
	$scope.createFormation = function() {
		_playbookModals.createFormation();
	}
	$scope.openFormationInEditor = function(formation: Common.Models.Formation) {
		_playbook.editFormation(formation);
		_playbook.refreshEditor();
	}
	$scope.openPlayInEditor = function(play: Common.Models.Play) {
		_playbook.editPlay(play);
		_playbook.refreshEditor();
	}

	$scope.goToPlays();

	console.debug('controller: playbook.browser.sidebar.ctrl', __router.templates);

}]);