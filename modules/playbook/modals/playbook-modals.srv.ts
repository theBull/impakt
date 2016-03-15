/// <reference path='./playbook-modals.mdl.ts' />

impakt.playbook.modals.service('_playbookModals', [
'__modals',
function(__modals: any) {

	/**
	 * 
	 * PLAYBOOK
	 * 
	 */
	this.createPlaybook = function() {
		console.log('create playbook');
		let modalInstance = __modals.open(
			'',
			'modules/playbook/modals/create-playbook/create-playbook.tpl.html',
			'playbook.modals.createPlaybook.ctrl',
			{}
		);

		modalInstance.result.then(function(createdPlaybook) {
			console.log(createdPlaybook);
		}, function(results) {
			console.log('dismissed');
		});
	}
	this.deletePlaybook = function(playbook: Playbook.Models.PlaybookModel) {
		let modalInstance = __modals.open(
			'',
			'modules/playbook/modals/delete-playbook/delete-playbook.tpl.html',
			'playbook.modals.deletePlaybook.ctrl',
			{
				playbook: function() {
					return playbook;
				}
			}
		);

		modalInstance.result.then(function(results) {
			console.log(results);
		}, function(results) {
			console.log('dismissed');
		});
	}

	/**
	 * 
	 * PLAY
	 * 
	 */
	this.createPlay = function() {
		console.log('create play');
		let modalInstance = __modals.open(
			'lg',
			'modules/playbook/modals/create-play/create-play.tpl.html',
			'playbook.modals.createPlay.ctrl',
			{}
		);

		modalInstance.result.then(function(createdPlaybook) {
			console.log(createdPlaybook);
		}, function(results) {
			console.log('dismissed');
		});
	}
	this.savePlay = function(play: Playbook.Models.Play) {
		let template, controller, data, size;
		if (play.editorType == Playbook.Editor.EditorTypes.Play) {
			size = 'lg';
			template = 'modules/playbook/modals/save-play/save-play.tpl.html';
			controller = 'playbook.modals.savePlay.ctrl';
			data = {
				play: function() {
					return play;
				}
			};
		} else if (play.editorType == Playbook.Editor.EditorTypes.Formation) {
			size = '';
			template = 'modules/playbook/modals/save-formation/save-formation.tpl.html';
			controller = 'playbook.modals.saveFormation.ctrl';
			data = {
				formation: function() {
					return play.formation;
				}
			}
		}

		let modalInstance = __modals.open(
			size,
			template,
			controller,
			data
		);

		modalInstance.result.then(function(results) {
			console.log(results);
		}, function(results) {
			console.log('dismissed');
		});
	}
	this.deletePlay = function(play: Playbook.Models.PlaybookModel) {
		let modalInstance = __modals.open(
			'',
			'modules/playbook/modals/delete-play/delete-play.tpl.html',
			'playbook.modals.deletePlay.ctrl',
			{
				play: function() {
					return play;
				}
			}
		);

		modalInstance.result.then(function(results) {
			console.log(results);
		}, function(results) {
			console.log('dismissed');
		});
	}


	/**
	 * 
	 * FORMATION
	 * 
	 */
	this.createFormation = function() {

		let modalInstance = __modals.open(
			'',
			'modules/playbook/modals/create-formation/create-formation.tpl.html',
			'playbook.modals.createFormation.ctrl',
			{}
		);

		modalInstance.result.then(function(createdFormation) {

		}, function(results) {

		});
	}
	this.deleteFormation = function(formation: Playbook.Models.Formation) {
		console.log('delete formation');
		let modalInstance = __modals.open(
			'',
			'modules/playbook/modals/delete-formation/delete-formation.tpl.html',
			'playbook.modals.deleteFormation.ctrl',
			{
				formation: function() {
					return formation;
				}
			}
		);

		modalInstance.result.then(function(results) {

		}, function(results) {
			console.log('dismissed');
		});
	}

	this.openNewEditorTab = function() {
		console.log('new editor tab');
		let modalInstance = __modals.open(
			'',
			'modules/playbook/modals/new-editor/new-editor.tpl.html',
			'playbook.modals.newEditor.ctrl',
			{
				data: function() {
					return 1;
				}
			}
		);

		modalInstance.result.then(function(data) {
			console.log(data);
		}, function(results) {
			console.log('dismissed');
		});
	}

}]);