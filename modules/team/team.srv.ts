/// <reference path='./team.mdl.ts' />

// Team service
impakt.team.service('_team',
	['$q', 'PLAYBOOK', 'TEAM', '__api', '__notifications',
	function($q: any, PLAYBOOK: any, TEAM: any, __api: any, __notifications: any) {

    this.personnel = impakt.context.Team.personnel;

    this.savePersonnel = function(
    	personnelModel: Team.Models.Personnel,
		createNew?: boolean
    ) {
		let d = $q.defer();
		let result;

		let notification = __notifications.pending('Saving personnel "', personnelModel.name, '"...');
	
		if (createNew) {
			personnelModel.key = 0;
			personnelModel.guid = Common.Utilities.guid();
			result = this.createPersonnel(personnelModel);			
		} else {
			result = this.updatePersonnel(personnelModel);
		}
		result.then(function(results) {
			notification.success('Successfully saved personnel "', personnelModel.name, '"');
			d.resolve(results);
		}, function(err) {
			notification.error('Failed to save personnel "', personnelModel.name, '"');
			d.reject(err);
		});

		return d.promise;
    }

    this.createPersonnel = function(personnelModel: Team.Models.Personnel) {
		let d = $q.defer();
		let personnelJson = personnelModel.toJson();
		let notification = __notifications.pending(
			'Creating personnel group "', personnelModel.name, '"...'
		);
		__api.post(
            __api.path(PLAYBOOK.ENDPOINT, PLAYBOOK.CREATE_SET),
            {
				version: 1,
				ownerRK: 1,
				parentRK: 1,
				name: personnelJson.name,
				data: {
					setType: Common.Enums.SetTypes.Personnel,
					personnel: personnelJson,
					name: personnelJson.name,
					version: 1,
					ownerRK: 1,
					parentRK: 1
				}
            }
        )
        .then(function(response: any) {
            let results = Common.Utilities.parseData(response.data.results);

			let personnelModel = new Team.Models.Personnel();
			if (results && results.data && results.data.personnel) {
				results.data.personnel.key = results.key;
				personnelModel.fromJson(results.data.personnel);
			}

			impakt.context.Team.personnel.add(personnelModel);

			notification.success(
				'Personnel group "', personnelModel.name, '" successfully created'
			);

			d.resolve(personnelModel);
        }, function(error: any) {
            d.reject(error);
        });

		return d.promise;
    }

    this.updatePersonnel = function(personnelModel: Team.Models.Personnel) {
		let d = $q.defer();
		let personnelJson = personnelModel.toJson();

		let notification = __notifications.pending('Updating personnel "', personnelModel.name, '"...');

		__api.post(
            __api.path(PLAYBOOK.ENDPOINT, PLAYBOOK.UPDATE_SET),
            {
				version: 1,
				name: personnelJson.name,
				key: personnelJson.key,
				data: {
					setType: Common.Enums.SetTypes.Personnel,
					personnel: personnelJson,
					name: personnelJson.name,
					key: personnelJson.key,
					version: 1
				}
            }
        ) 
		.then(function(response: any) {
			let results = Common.Utilities.parseData(response.data.results);

			let personnelModel = new Team.Models.Personnel();
			if(results && results.data && results.data.personnel) {
				personnelModel.fromJson(results.data.personnel);
			}

			impakt.context.Team.personnel.set(personnelModel.guid, personnelModel);

			notification.success('Successfully updated personnel "', personnelModel.name, '"...');

			d.resolve(personnelModel);
		}, function(error: any) {
			notification.error('Failed to update personnel "', personnelModel.name, '"...');
			d.reject(error);
		});

		return d.promise;
    }

    this.deletePersonnel = function(personnelModel: Team.Models.Personnel) {
		let d = $q.defer();

		let notification = __notifications.pending('Deleting personnel "', personnelModel.name, '"...');

		__api.post(
			__api.path(PLAYBOOK.ENDPOINT, PLAYBOOK.DELETE_SET), { 
				key: personnelModel.key 
		}).then(function(response: any) {
			impakt.context.Team.personnel.remove(personnelModel.guid);
			notification.success('Successfully saved personnel "', personnelModel.name, '"');
			d.resolve(response);
		}, function(err) {
			notification.error('Failed to save personnel "', personnelModel.name, '"');
			d.reject(err);
		})
		return d.promise;
    }

}]);