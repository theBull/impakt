/// <reference path='./associations.mdl.ts' />

// Association service
impakt.common.associations.service('_associations',
[
'ASSOCIATIONS',
'$q',
'__api',
'__localStorage',
'__notifications',
function(
	ASSOCIATIONS: any,
	$q: any,
	__api: any,
	__localStorage: any,
	__notifications: any
) {

	/**
	 * Global associations model;
	 *
	 * Manages associations between all entities/entityTypes
	 * as a bi-directional association.
	 * 
	 */
	let organizationKey = __localStorage.getOrganizationKey();
	this.associations = new Common.Models.AssociationCollection(organizationKey);

	/**
	 * Get associations by context (organization key)
	 */
	this.getAssociationsByContextId = function() {
		let d = $q.defer();
			
		// Get organization key
		let organizationKey = __localStorage.getOrganizationKey();

		let notification = __notifications.pending(
			'Retrieving Association data for Organization ', organizationKey, '...');

		if(Common.Utilities.isNullOrUndefined(organizationKey)) {
			notification.error('Failed to retrieve associations for Organization ', organizationKey, '');
			d.reject(['Organization Key is invalid when attempting\
				 to request all Associations: (', organizationKey, ')'].join(''));
		}

		// make request
		__api.get(__api.path(
			ASSOCIATIONS.ENDPOINT, 
			ASSOCIATIONS.GET_ASSOCIATIONS_FOR_CONTEXT
		), {
			contextId: organizationKey + ''
		}).then(function(associations: any) {
			let collection = new Common.Models.AssociationCollection(organizationKey);
			if(associations && associations.data && associations.data.results) {
				collection.fromJson(associations.data.results);
			}
			notification.success(collection.size(), ' Associations successfully retrieved');
			d.resolve(collection);
		}, function(err: any) {
			notification.error('Failed to retrieve Associations for Organization ', organizationKey, '');
			d.reject(err);
		});
		
		return d.promise;
	}

	/**
	* Get associations by entity key
	*/
	this.getAssociationsByEntityKey = function() {

	}

	/**
	* Update assocations
	*/
	this.updateAssociations = function() {
		let d = $q.defer();

		let organizationKey = __localStorage.getOrganizationKey();

		let notification = __notifications.pending(
			'Updating data associations...');
		
		let associationsJson = impakt.context.Associations.associations.toJson();

		__api.post(__api.path(
			ASSOCIATIONS.ENDPOINT,
			ASSOCIATIONS.UPDATE_ASSOCIATIONS
		), {
			version: 1,
			contextID: organizationKey + '',
			associations: associationsJson
		}).then(function(updatedAssociations: any) {
			notification.success(
				impakt.context.Associations.associations.size(), 
				' Associations successfully updated'
			);
			d.resolve();
		}, function(err: any) {
			notification.error('Failed to update Associations');
			d.reject(err);
		});

		return d.promise;
	}



	/**
	* Delete associations
	*/
	this.deleteAssociations = function(internalKey: string) {
		let d = $q.defer();

		let organizationKey = __localStorage.getOrganizationKey();

		let notification = __notifications.pending(
			'Deleting ', 'data associations...');

		let associations = impakt.context.Associations.associations.delete(internalKey);

		__api.post(__api.path(
			ASSOCIATIONS.ENDPOINT,
			ASSOCIATIONS.UPDATE_ASSOCIATIONS
		), {
			contextID: organizationKey,
			associations: associations.toJson()
		}).then(function() {
			notification.success(
				associations.size(),
				' Associations successfully deleted'
			);
			d.resolve();
		}, function(err: any) {
			notification.error('Failed to update Associations');
			d.reject(err);
		});

		return d.promise;
	}

	/**
	* Delete association
	*/
	this.deleteAssociation = function(
		fromEntity: Common.Interfaces.IAssociable,
		toEntity: Common.Interfaces.IAssociable
	): void {
		let d = $q.defer();
		impakt.context.Associations.associations.disassociate(fromEntity, toEntity);

		this.updateAssociations()
			.then(function() {
				d.resolve();
			}, function(err: any) {
				d.reject(err);
			});

		return d.promise;
	}

	/**
	* Create association
	*/
	this.createAssociation = function(
		fromEntity: Common.Interfaces.IAssociable, 
		toEntity: Common.Interfaces.IAssociable
	): void {
		let d = $q.defer();
		impakt.context.Associations.associations.add(fromEntity, toEntity);

		this.updateAssociations()
		.then(function() {
			d.resolve();
		}, function(err: any) {
			d.reject(err);
		});

		return d.promise;
	}

	this.createAssociations = function(
		fromEntity: Common.Interfaces.IAssociable,
		associatedEntities: Common.Interfaces.IAssociable[]
	): void {
		let d = $q.defer();
		impakt.context.Associations.associations.addAll(fromEntity, associatedEntities);

		this.updateAssociations()
		.then(function() {
			d.resolve();
		}, function(err: any) {
			d.reject(err);
		});

		return d.promise;
	}

	/**
	 * Gets all associated entities for the given IAssociable.
	 * 
	 * @param  {Common.Interfaces.IAssociable} entity The entity for which to find associated entities
	 * @return {any}                                  returns an object literal which contains
	 *                                                a key representing each type of entity collection
	 *                                                (playbooks, plays, formations, etc.), and
	 *                                                a corresponding collection of that entity type,
	 *                                                which will be empty if no associations of that
	 *                                                type are found, or will be populated with entities
	 *                                                of the given type if associations are found
	 */
	this.getAssociated = function(entity: Common.Interfaces.IAssociable): Common.Models.AssociationResults {

		// 
		// Gets the associations for the given entity by its associationKey
		// 
		let associations = impakt.context.Associations.associations.getByInternalKey(
			entity.associationKey
		);

		// Instantiate the set of association collections for the given
		// entity.
		// NOTE: the return type of this function must mimic the typed contents
		// of this results object
		let results = new Common.Models.AssociationResults();

		//
		// Clients of this service should expect to receive back
		// a resulting set of associations, even if the collections
		// are empty. This should help prevent null pointer exceptions
		// when attempting to create ng-repeat bindings in the view logic
		// which rely on use of the .toArray() method on the given
		// collection.
		// 
		if (Common.Utilities.isNullOrUndefined(associations) ||
			associations.length == 0)
			return results;


		// Iterate over the entity's associations and parse each one
		// to:
		// 1. retrieve its guid
		// 2. determine its type
		// 3. make a query to the correct app. context collection
		for (let i = 0; i < associations.length; i++) {
			// each element in the associations array is in 'internalKey' structure
			// i.e. '<type>|<key>|<guid>''; parse(...) yields an
			// AssociationParts object with the corresponding and correctly typed values
			let associationParts = Common.Models.Association.parse(associations[i]);
			if (Common.Utilities.isNullOrUndefined(associationParts))
				continue;

			let guid = associationParts.entityGuid;
			let type = associationParts.entityType;

			//
			// Gets the appropriate application context collection 
			// for the given entity's impakt data type enum value
			// 
			switch (type) {
				case Common.Enums.ImpaktDataTypes.Playbook:
					let playbook = impakt.context.Playbook.playbooks.get(guid);
					if (playbook)
						results.playbooks.add(playbook);
					break;
				case Common.Enums.ImpaktDataTypes.Scenario:
					let scenario = impakt.context.Playbook.scenarios.get(guid);
					if (scenario)
						results.scenarios.add(scenario);
					break;
				case Common.Enums.ImpaktDataTypes.Play:
					let play = impakt.context.Playbook.plays.get(guid);
					if (play)
						results.plays.add(play);
					break;
				case Common.Enums.ImpaktDataTypes.Formation:
					let formation = impakt.context.Playbook.formations.get(guid);
					if (formation)
						results.formations.add(formation);
					break;
				case Common.Enums.ImpaktDataTypes.PersonnelGroup:
					let personnel = impakt.context.Team.personnel.get(guid);
					if (personnel)
						results.personnel.add(personnel);
					break;
				case Common.Enums.ImpaktDataTypes.AssignmentGroup:
					let assignmentGroup = impakt.context.Playbook.assignmentGroups.get(guid);
					if (assignmentGroup)
						results.assignmentGroups.add(assignmentGroup);
					break;
				case Common.Enums.ImpaktDataTypes.League:
					let league = impakt.context.League.leagues.get(guid);
					if (league)
						results.leagues.add(league);
					break;
				case Common.Enums.ImpaktDataTypes.Conference:
					let conference = impakt.context.League.conferences.get(guid);
					if (conference)
						results.conferences.add(conference);
					break;
			}		
		}

		return results;
	}

	this.associationExists = function(fromInternalKey: string, toInternalKey: string): boolean {
		return this.associations.associationExists(fromInternalKey, toInternalKey);
	}

	this.getContextDataByKey = function(key: string): Common.Interfaces.ICollection<any> {
		if (Common.Utilities.isNullOrUndefined(key))
			throw new Error('_associations getContextDataByKey(): key is null or undefined');

		let collection;

		switch(key) {
			case 'playbooks':
				collection = impakt.context.Playbook.playbooks;
				break;

			case 'scenarios':
				collection = impakt.context.Playbook.scenarios;
				break;

			case 'plays':
				collection = impakt.context.Playbook.plays;
				break;

			case 'formations':
				collection = impakt.context.Playbook.formations;
				break;

			case 'personnel':
				collection = impakt.context.Team.personnel;
				break

			case 'assignmentGroups':
				collection = impakt.context.Playbook.assignmentGroups;
				break;

			case 'leagues':
				collection = impakt.context.League.leagues;
				break;

			case 'conferences':
				collection = impakt.context.League.conferences;
				break;

			case 'teams':
				collection = impakt.context.Team.teams;
				break;
		}

		let parsedCollection = new Common.Models.ActionableCollection<Common.Interfaces.IActionable>();
		if(Common.Utilities.isNotNullOrUndefined(collection)) {
			// create another reference of the entity into the parsed collection
			collection.forEach(function(element: Common.Interfaces.IActionable, index: number) {
				parsedCollection.add(element, false);
			});
		}

		return parsedCollection;
	}

}]);