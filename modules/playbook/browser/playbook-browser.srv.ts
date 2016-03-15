/// <reference path='./playbook-browser.mdl.ts' />

declare var impakt: any;

impakt.playbook.browser.service('_playbookBrowser',
[
'$rootScope', 
'$q', 
'$state', 
'__localStorage', 
'_playbook',
function(
	$rootScope: any, 
	$q: any, 
	$state: any,  
	__localStorage: any, 
	_playbook: any) {
	console.debug('service: impakt.playbook.browser');

	var self = this;

	// playbook data by playbook type
	this.playbookData = new Playbook.Models.PlaybookData();

	// Set browser to expanded or collapsed by default
	this.isCollapsed = false;

	this.init = function() {
		// TODO - issue #43 raised for faulty getFormation response
		this.checkForDefaultItem();
		
		this.getPlaybooks();
	}

	this.getPositionList = function(type: Playbook.Editor.UnitTypes) {
		return impakt.context.positionDefaults.getByUnitType(type);
	}

	this.checkForDefaultItem = function() {
		let d = $q.defer();
        
        if (__localStorage.isDefaultEditorInfoSet()) {
			let editorInfo = __localStorage.getDefaultEditorInfo();
            	
				// this.playbookData.getType(editorInfo.itemType);

    // 			_playbook.getPlaybook(editorInfo.playbookKey)
				// .then(function(playbook) {

				// 	_playbook.getFormation(editorInfo.editorItemKey)
				// 	.then(function(formation) {
						
				// 		$state.transitionTo('playbook.editor', {
				// 			itemType: editorInfo.editorItemType,
				// 			playbookKey: editorInfo.playbookKey,
				// 			editorType: editorInfo.editorType,
				// 			itemKey: editorInfo.editorItemKey,
				// 			data: formation
				// 		});

				// 		d.resolve(playbook);
				// 	}, function(err) {
				// 		d.reject(err);
				// 	});
				// }, function(err) {
				// 	d.reject(err);
				// });
        }
        return d.promise;
    }

	this.resetDefaultPlaybook = function() {
		$state.transitionTo('playbook');
		__localStorage.resetDefaultPlaybook();
	}

	this.refreshPlaybook = function(key) {
		let d = $q.defer();
		this.getPlaybook(key).then(function(playbook) {
			d.resolve(playbook);
		}, function(err) {
			d.reject(err);
		});
		return d.promise;
	}

	this.getPlaybooks = function() {
		return _playbook.getPlaybooks().then(function(playbooks) {
			console.log(playbooks);

			self.playbookData.fromJson(playbooks);
			
			self.ready(self.playbookData);
		}, function(err) {
			console.error(err);
		});
	}

	this.getPlaybook = function(key) {
		let d = $q.defer();
		_playbook.getPlaybook(key).then(function(playbook) {
			
			self.playbookData.get(playbook.type).set(key, playbook);

			self.getFormations(key)
				.then(function(formations: Playbook.Models.FormationCollection) {
						
					// to do
					d.resolve(playbook);				
			
			}, function(err) {
				d.reject(err);
			});
			
		}, function(err) {
			console.error(err);
			d.reject(err);
		});
		return d.promise;
	}

	this.createPlaybook = function(name, unitType) {
		var d = $q.defer();

		let playbookModel = new Playbook.Models.PlaybookModel();
		playbookModel.fromJson({
			key: -1,
			name: name,
			unitType: unitType
		});

		_playbook.createPlaybook({
			version: 1,
			name: playbookModel.name,
			data: {
				version: 1,
				model: playbookModel,
				unitType: playbookModel.unitType
			}
		}).then(function(createdPlaybook: Playbook.Models.PlaybookModel) {
			impakt.context.Playbook.playbooks.add(createdPlaybook.guid, createdPlaybook);
			d.resolve(createdPlaybook);
		}, function(err) {
			console.error(err);
			d.reject(err);
		});

		return d.promise;
	}

	this.deletePlaybook = function(playbook) {
		var d = $q.defer();
		_playbook.deletePlaybook(
			{
				key: playbook.key
			}
		)
		.then(function(deletedPlaybook) {
			console.log('Playbook deleted: ', deletedPlaybook);
			
			self.playbookData.get(playbook.type).remove(playbook.key);

			d.resolve(playbook);
		}, function(err) {
			console.error(err);
			d.reject(err);
		});
		return d.promise;
	}

	this.getFormations = function(playbook: Playbook.Models.PlaybookModel) {
		let d = $q.defer();

		_playbook.getFormations(playbook).then(
			function(formationCollection: Playbook.Models.FormationCollection) {

				self.playbookData.setFormationCollection(formationCollection);
				d.resolve(formationCollection);		

		}, function(err) {
			d.reject(err);
		});

		return d.promise;
	}

	this.createFormation = function(
		name: string, 
		playbookGuid: string,
		unitTypeGuid: string
	) {
		var d = $q.defer();

		_playbook.createFormation(name, playbookGuid, unitTypeGuid)
		.then(function(formation: Playbook.Models.Formation) {

			// open the formation in the editor
			self.editFormation(formation);

			d.resolve(formation);

		}, function(err) {
			console.error(err);
			d.reject(err);
		});

		return d.promise;

	}

	this.deleteFormation = function(formation) {
		var d = $q.defer();
		_playbook.deleteFormation(formation)
			.then(function(deletedFormation) {
				d.resolve(deletedFormation);
			}, function(err) {
				console.error(err);
				d.reject(err);
			});
		return d.promise;
	}

	this.editFormation = function(formation: Playbook.Models.Formation) {
		__localStorage.setDefaultEditorInfo(
			formation.parentRK,
			formation.editorType,
			formation.key,
			formation.unitType
		);

		let play = new Playbook.Models.Play();
		play.formation = formation;

		if ($state.is('playbook.editor')) {
			console.log('Editor is open');
			$rootScope.$broadcast(
				'playbook-editor-tab.open',
				play
			);
		} else {
			$state.transitionTo('playbook.editor', {
				data: play
			});
		}
	}

	this.getSets = function(playbook) {
		throw new Error('playbook.browser.srv getSets() not implemented');
	}

	this.createSet = function(set) {
		throw new Error('playbook.browser.srv createSet() not implemented');
	}


	this.toggleUnitType = function(unitType) {
		unitType.active = !unitType.active;
		if (unitType.active) {
			__localStorage.setDefaultPlaybookUnitType(unitType.unitType);
		} else {
			// reset the current playbook type
			__localStorage.resetDefaultPlaybookUnitType();
			// reset the current playbook key
			__localStorage.resetDefaultPlaybookKey();
		}
	}

	this.togglePlaybook = function(playbook) {
		playbook.active = !playbook.active;
		if (playbook.active) {
			__localStorage.setDefaultPlaybookKey(playbook.key);
		} else {
			__localStorage.resetDefaultPlaybookKey();
		}
	}

	this.ready = function(data) {
		this.readyCallback(data);
	}

	this.onready = function(callback) {
		this.readyCallback = callback;
	}

	this.readyCallback = function(data) {
		console.log('playbook browser ready...data: ', data);
	}

	this.collapseCallback = function() {
		console.log('playbook browser collapse (default)');
	}
	this.expandCallback = function() {
		console.log('playbook browser expand (default)');
	}

	this.toggleCallback = function(isCollapsed) {
		console.log('playbook browser toggle (default)', isCollapsed);
	}

	this.collapse = function() {
		this.collapseCallback();
	}

	this.oncollapse = function(callback) {
		this.collapseCallback = callback;
	}

	this.toggle = function() {
		this.isCollapsed = !this.isCollapsed;
		this.isCollapsed ? this.collapse() : this.expand();
		this.toggleCallback(this.isCollapsed);
	}

	this.ontoggle = function(callback) {
		this.toggleCallback = callback;
	}

	this.expand = function() {
		this.isCollapsed = false;
		this.expandCallback();
	}

	this.onexpand = function(callback) {
		this.expandCallback = callback;
	}

	$rootScope.$on('playbook-browser.toggle',
		function(e: any, data: any) {
			
		});

	$rootScope.$on('playbook-browser.collapse',
		function(e: any, data: any) {
			self.collapse();
		});

	this.init();

}]);