/// <reference path='./playbook-browser-main.mdl.ts' />

impakt.playbook.browser.main.controller('playbook.browser.main.ctrl', [
'$scope',
'__context',
'__router',
'_playbook',
'_playbookModals',
function(
	$scope: any, 
	__context: any,
	__router: any, 
	_playbook: any, 
	_playbookModals: any) {
	
	let parent = 'playbook.browser.main';
	__router.push(
		parent, [
			new Common.Models.Template(
				'playbook.browser.main.all',
				'modules/playbook/browser/main/all/playbook-browser-main-all.tpl.html'
			),
			new Common.Models.Template(
				'playbook.browser.main.playbook',
				'modules/playbook/browser/main/playbook/playbook-browser-playbook.tpl.html'
			)
	]);
	$scope.template = {};

	$scope.editor = impakt.context.Playbook.editor;
	$scope.playbooks = impakt.context.Playbook.playbooks;
	$scope.formations = impakt.context.Playbook.formations;
	$scope.plays = impakt.context.Playbook.plays;

	__context.onReady(function() {
		$scope.playbooks = impakt.context.Playbook.playbooks;
		$scope.formations = impakt.context.Playbook.formations;
		$scope.plays = impakt.context.Playbook.plays;
	});


	$scope.goToAll = function() {
		$scope.template = __router.get(parent, 'playbook.browser.main.all');
	}

	$scope.goToPlaybook = function(playbook: Common.Models.PlaybookModel) {
		$scope.template = __router.get(parent, 'playbook.browser.main.playbook');
		$scope.template.data = playbook;
	}
	$scope.getEditorTypeClass = function(editorType: Playbook.Enums.EditorTypes) {
		return _playbook.getEditorTypeClass(editorType);
	}

	$scope.openEditor = function() {
		_playbook.toEditor();
	}
	$scope.openFormationInEditor = function(formation: Common.Models.Formation) {
		_playbook.editFormation(formation);
	}
	$scope.openPlayInEditor = function(play: Common.Models.Play) {
		_playbook.editPlay(play);
	}

	$scope.createPlaybook = function() {
		_playbookModals.createPlaybook();
	}
	$scope.deletePlaybook = function(playbook: Common.Models.PlaybookModel) {
		_playbookModals.deletePlaybook(playbook).then(function(data) {
			// navigate back to the main browser view
			$scope.goToAll();
		}, function(err) {

		});
	}
	$scope.createPlay = function() {
		_playbookModals.createPlay();
	}
	$scope.alertDataRequired = function(dataType: string) {
		if($scope.formations.isEmpty() && $scope.playbooks.hasElements()) {
			alert("Please create a base formation in order to begin creating " + dataType + ".");
		} else if($scope.playbooks.isEmpty()) {
			alert("Please create a playbook in order to begin creating " + dataType + ".");
		}
	}
	$scope.deletePlay = function(play: Common.Models.Play) {
		_playbookModals.deletePlay(play);
	}
	$scope.createFormation = function() {
		_playbookModals.createFormation();
	}
	$scope.deleteFormation = function(formation: Common.Models.Formation) {
		_playbookModals.deleteFormation(formation);
	}

	/** 
	 * Navigates to the main browser 'all' view
	 */
	$scope.goToAll();

}]);