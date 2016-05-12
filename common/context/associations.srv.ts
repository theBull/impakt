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
		
		let associations = impakt.context.Associations.creation.toJson();

		__api.post(__api.path(
			ASSOCIATIONS.ENDPOINT,
			ASSOCIATIONS.UPDATE_ASSOCIATIONS
		), {
			version: 1,
			contextID: organizationKey + '',
			associations: associations
		}).then(function(updatedAssociations: any) {
			notification.success(
				impakt.context.Associations.creation.size(), 
				' Associations successfully updated'
			);
			impakt.context.Associations.associations.merge(impakt.context.Associations.creation);
			impakt.context.Associations.creation.empty();
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
	* Create association
	*/
	this.createAssociation = function(
		fromEntity: Common.Interfaces.IAssociable, 
		toEntity: Common.Interfaces.IAssociable
	): void {
		let d = $q.defer();
		impakt.context.Associations.creation.add(fromEntity, toEntity);

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
		impakt.context.Associations.creation.addAll(fromEntity, associatedEntities);

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
	this.getAssociated = function(entity: Common.Interfaces.IAssociable): any {

		// 
		// Gets the associations for the given entity by its associationKey
		// 
		let associations = impakt.context.Associations.associations.getByInternalKey(
			entity.associationKey
		);

		// Instantiate the set of association collections for the given
		// entity.
		let results = {
			playbooks: new Common.Models.PlaybookModelCollection(
				Team.Enums.UnitTypes.Mixed
			),
			plays: new Common.Models.PlayCollection(
				Team.Enums.UnitTypes.Mixed
			),
			formations: new Common.Models.FormationCollection(
				Team.Enums.UnitTypes.Mixed
			),
			personnel: new Team.Models.PersonnelCollection(
				Team.Enums.UnitTypes.Mixed
			),
			assignmentGroups: new Common.Models.AssignmentGroupCollection(
				Team.Enums.UnitTypes.Mixed
			)
		};

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
					let personnel = impakt.context.Playbook.personnel.get(guid);
					if (personnel)
						results.personnel.add(personnel);
					break;
				case Common.Enums.ImpaktDataTypes.AssignmentGroup:
					let assignmentGroup = impakt.context.Playbook.assignmentGroups.get(guid);
					if (assignmentGroup)
						results.assignmentGroups.add(assignmentGroup);
					break;
			}		
		}

		return results;
	}

	this.associationExists = function(fromInternalKey: string, toInternalKey: string): boolean {
		return this.associations.associationExists(fromInternalKey, toInternalKey);
	}

}]);