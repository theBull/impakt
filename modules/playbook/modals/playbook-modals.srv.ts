/// <reference path='./playbook-modals.mdl.ts' />

impakt.playbook.modals.service('_playbookModals', [
'$q',
'__modals',
function($q: any, __modals: any) {

	/**
	 * 
	 * PLAYBOOK
	 * 
	 */
	this.createPlaybook = function() {
		let d = $q.defer();
		console.log('create playbook');
		let modalInstance = __modals.open(
			'',
			'modules/playbook/modals/create-playbook/create-playbook.tpl.html',
			'playbook.modals.createPlaybook.ctrl',
			{}
		);

		modalInstance.result.then(function(createdPlaybook) {
			console.log(createdPlaybook);
			d.resolve();
		}, function(results) {
			console.log('dismissed');
			d.reject();
		});
		return d.promise;
	}
	this.deletePlaybook = function(playbook: Common.Models.PlaybookModel) {
		let d = $q.defer();
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
			d.resolve();
		}, function(results) {
			console.log('dismissed');
			d.reject();
		});
		return d.promise;
	}

	/**
	 * 
	 * PLAY
	 * 
	 */
	this.createPlay = function() {
		let d = $q.defer();
		console.log('create play');
		let modalInstance = __modals.open(
			'lg',
			'modules/playbook/modals/create-play/create-play.tpl.html',
			'playbook.modals.createPlay.ctrl',
			{}
		);

		modalInstance.result.then(function(createdPlaybook) {
			console.log(createdPlaybook);
			d.resolve();
		}, function(results) {
			console.log('dismissed');
			d.reject();
		});

		return d.promise;
	}
	this.savePlay = function(play: Common.Models.Play) {
		let d = $q.defer();
		let template, controller, data, size;
		if (play.editorType == Playbook.Enums.EditorTypes.Play) {
			size = 'lg';
			template = 'modules/playbook/modals/save-play/save-play.tpl.html';
			controller = 'playbook.modals.savePlay.ctrl';
			data = {
				play: function() {
					return play;
				}
			};
		} else if (play.editorType == Playbook.Enums.EditorTypes.Formation) {
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
			d.resolve();
		}, function(results) {
			console.log('dismissed');
			d.reject();
		});

		return d.promise;
	}
	this.deletePlay = function(play: Common.Models.PlaybookModel) {
		let d = $q.defer();
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
			d.resolve();
		}, function(results) {
			console.log('dismissed');
			d.reject();
		});

		return d.promise;
	}


	/**
	 * 
	 * FORMATION
	 * 
	 */
	this.createFormation = function() {
		let d = $q.defer();
		let modalInstance = __modals.open(
			'',
			'modules/playbook/modals/create-formation/create-formation.tpl.html',
			'playbook.modals.createFormation.ctrl',
			{}
		);

		modalInstance.result.then(function(createdFormation) {
			d.resolve();
		}, function(results) {
			d.reject();
		});

		return d.promise;
	}
	this.deleteFormation = function(formation: Common.Models.Formation) {
		let d = $q.defer();
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
			d.resolve();			
		}, function(results) {
			console.log('dismissed');
			d.reject();
		});

		return d.promise;
	}

	this.openNewEditorTab = function() {
		let d = $q.defer();
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
			d.resolve();
		}, function(results) {
			console.log('dismissed');
			d.reject();
		});

		return d.promise;
	}

}]);