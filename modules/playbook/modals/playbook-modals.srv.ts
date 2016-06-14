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
	this.createPlaybookDuplicate = function(playbookModel: Common.Models.PlaybookModel) {
		let d = $q.defer();
		let modalInstance = __modals.open(
			'',
			'modules/playbook/modals/create-playbook-duplicate-error/create-playbook-duplicate-error.tpl.html',
			'playbook.modals.createPlaybookDuplicateError.ctrl',
			{
				playbook: function() {
					return playbookModel;
				}
			}
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
	this.savePlaybook = function(playbook: Common.Models.PlaybookModel) {
		let d = $q.defer();
		
		let modalInstance = __modals.open(
			'',
			'modules/playbook/modals/save-playbook/save-playbook.tpl.html',
			'playbook.modals.savePlaybook.ctrl',
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
	 * SCENARIO
	 * 
	 */
	this.createScenario = function() {
		let d = $q.defer();
		console.log('create scenario');
		let modalInstance = __modals.open(
			'lg',
			'modules/playbook/modals/create-scenario/create-scenario.tpl.html',
			'playbook.modals.createScenario.ctrl',
			{}
		);

		modalInstance.result.then(function(createdScenario) {
			console.log(createdScenario);
			d.resolve();
		}, function(results) {
			console.log('dismissed');
			d.reject();
		});

		return d.promise;
	}
	this.saveScenario = function(scenario: Common.Models.Scenario) {
		let d = $q.defer();
		
		let modalInstance = __modals.open(
			'lg',
			'modules/playbook/modals/save-scenario/save-scenario.tpl.html',
			'playbook.modals.saveScenario.ctrl',
			{
				scenario: function() {
					return scenario;
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
	this.deleteScenario = function(scenario: Common.Models.Scenario) {
		let d = $q.defer();
		let modalInstance = __modals.open(
			'',
			'modules/playbook/modals/delete-scenario/delete-scenario.tpl.html',
			'playbook.modals.deleteScenario.ctrl',
			{
				scenario: function() {
					return scenario;
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

		modalInstance.result.then(function(createdPlay) {
			console.log(createdPlay);
			d.resolve();
		}, function(results) {
			console.log('dismissed');
			d.reject();
		});

		return d.promise;
	}
	this.savePlay = function(play: Common.Models.Play) {
		let d = $q.defer();
		
		let modalInstance = __modals.open(
			'lg',
			'modules/playbook/modals/save-play/save-play.tpl.html',
			'playbook.modals.savePlay.ctrl',
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
	this.deletePlay = function(play: Common.Models.Play) {
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
			'lg',
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
	this.saveFormation = function(play: Common.Models.Play) {
		let d = $q.defer();
		
		let modalInstance = __modals.open(
			'lg',
			'modules/playbook/modals/save-formation/save-formation.tpl.html',
			'playbook.modals.saveFormation.ctrl',
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


	this.deleteAssignmentGroup = function(assignmentGroup: Common.Models.AssignmentGroup) {
		let d = $q.defer();

		let modalInstance = __modals.open(
			'',
			'modules/playbook/modals/delete-assignmentGroup/delete-assignmentGroup.tpl.html',
			'playbook.modals.deleteAssignmentGroup.ctrl',
			{
				assignmentGroup: function() {
					return assignmentGroup;
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