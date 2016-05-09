/// <reference path='./playbook-sidebar.mdl.ts' />

impakt.playbook.sidebar.controller('playbook.sidebar.ctrl', [
'$scope',
'__router',
'_playbook',
'_playbookModals',
function($scope: any, __router: any, _playbook: any, _playbookModals: any) {

	let parent = 'playbook.sidebar';
	__router.push(
		parent, [
			new Common.Models.Template(
				'playbook.sidebar.playbooks',
				'modules/playbook/sidebar/playbook/playbook-sidebar-playbooks.tpl.html'
			),
			new Common.Models.Template(
				'playbook.sidebar.plays',
				'modules/playbook/sidebar/play/playbook-sidebar-plays.tpl.html'
			),
			new Common.Models.Template(
				'playbook.sidebar.formations',
				'modules/playbook/sidebar/formation/playbook-sidebar-formations.tpl.html'
			)
		]);

	$scope.template = {};

	$scope.plays = impakt.context.Playbook.plays;
	$scope.formations = impakt.context.Playbook.formations;
	$scope.playbooks = impakt.context.Playbook.playbooks;

	
	$scope.goToPlaybooks = function() {
		$scope.template = __router.get(parent, 'playbook.sidebar.playbooks');
	}
	$scope.goToPlays = function() {
		$scope.template = __router.get(parent, 'playbook.sidebar.plays');
	}
	$scope.goToFormations = function() {
		$scope.template = __router.get(parent, 'playbook.sidebar.formations');
	}

	$scope.refreshPlays = function() {
		$scope.plays = impakt.context.Playbook.plays;
	}
	$scope.refreshFormations = function() {
		$scope.formations = impakt.context.Playbook.formations;
	}
	$scope.refreshPlaybooks = function() {
		$scope.playbooks = impakt.context.Playbook.playbooks;
	}
	$scope.createPlay = function() {
		_playbookModals.createPlay();
	}
	$scope.createFormation = function() {
		_playbookModals.createFormation();
	}
	$scope.createPlaybook = function() {
		_playbookModals.createPlaybook();
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

}]);