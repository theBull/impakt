/// <reference path='./team.mdl.ts' />

// Team service
impakt.team.service('_team',
	['$q', 'PLAYBOOK', 'TEAM', '__api', '__notifications',
	function($q: any, PLAYBOOK: any, TEAM: any, __api: any, __notifications: any) {

    this.personnel = impakt.context.Playbook.personnel;

    this.savePersonnel = function(
    	personnelModel: Playbook.Models.Personnel,
		createNew?: boolean
    ) {
		let d = $q.defer();
		let result;
	
		if (createNew) {
			personnelModel.key = 0;
			personnelModel.guid = Common.Utilities.guid();
			result = this.createPersonnel(personnelModel);			
		} else {
			result = this.updatePersonnel(personnelModel);
		}
		result.then(function(results) {
			d.resolve(results);
		}, function(err) {
			d.reject(err);
		});

		return d.promise;
    }

    this.createPersonnel = function(personnelModel: Playbook.Models.Personnel) {
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
					setType: Playbook.Editor.SetTypes.Personnel,
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

			let personnelModel = new Playbook.Models.Personnel();
			if (results && results.data && results.data.personnel) {
				results.data.personnel.key = results.key;
				personnelModel.fromJson(results.data.personnel);
			}

			impakt.context.Playbook.personnel.add(personnelModel);

			notification.success(
				'Personnel group "', personnelModel.name, '" successfully created'
			);

			d.resolve(personnelModel);
        }, function(error: any) {
            d.reject(error);
        });

		return d.promise;
    }

    this.updatePersonnel = function(personnelModel: Playbook.Models.Personnel) {
		let d = $q.defer();
		let personnelJson = personnelModel.toJson();
		__api.post(
            __api.path(PLAYBOOK.ENDPOINT, PLAYBOOK.UPDATE_SET),
            {
				version: 1,
				name: personnelJson.name,
				key: personnelJson.key,
				data: {
					setType: Playbook.Editor.SetTypes.Personnel,
					personnel: personnelJson,
					name: personnelJson.name,
					key: personnelJson.key,
					version: 1
				}
            }
        ) 
		.then(function(response: any) {
			let results = Common.Utilities.parseData(response.data.results);

			let personnelModel = new Playbook.Models.Personnel();
			if(results && results.data && results.data.personnel) {
				personnelModel.fromJson(results.data.personnel);
			}

			impakt.context.Playbook.personnel.set(personnelModel.guid, personnelModel);

			d.resolve(personnelModel);
		}, function(error: any) {
			d.reject(error);
		});

		return d.promise;
    }

    this.deletePersonnel = function(personnel: Playbook.Models.Personnel) {
		let d = $q.defer();
		__api.post(
			__api.path(PLAYBOOK.ENDPOINT, PLAYBOOK.DELETE_SET),
			{ key: personnel.key }
		).then(function(response: any) {
			impakt.context.Playbook.personnel.remove(personnel.guid);
			d.resolve(response);
		}, function(err) {
			d.reject(err);
		})
		return d.promise;
    }

}]);