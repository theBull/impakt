/// <reference path='./models.ts' />

module Common.Models {

	export abstract class APIOptions {
		// Entity for which to create applicable options
		public entity: Common.Interfaces.IAssociable;
		public associated: any;

		constructor(entity: Common.Interfaces.IAssociable) {
			if(Common.Utilities.isNullOrUndefined(entity))
				throw new Error('APIOptions constructor(): Entity is null or undefined');
			
			this.entity = entity;
			this.associated = {};
			this._populateAssociated();
		}

		/**
		 * Takes the given entity's associable array (types of Associable Entities that
		 * entity is able to associate with), and returns an object literal, where
		 * each given associable TYPE (i.e. 'playbooks', 'formations', 'teams', etc.)
		 * are the keys and an array of IAssociable[] entities of the given type are
		 * their values, respectively.
		 *
		 * Creates a populated associations object:
		 * <associatedEntityType(string)>: <IAssociable>}
		 * {'playbooks': <PlaybookModel>[], 'formations': <FormationModel>[], etc...}
		 * 
		 * @return {any} [description]
		 */
		private _populateAssociated(): any {
			if(Common.Utilities.isNotNullOrUndefined(this.entity) &&
				Common.Utilities.isNotNullOrUndefined(this.entity.associable)) {

				for(let i = 0; i < this.entity.associable.length; i++) {
					let associableEntityType = this.entity.associable[i];
					this.associated[associableEntityType] = [];
				}
			}
		}

		public associatedToArray(): Common.Interfaces.IAssociable[] {

			let associations = [];
			if(Common.Utilities.isNullOrUndefined(this.associated))
				return associations;

			for(let associationEntityType in this.associated) {
				let associatedEntityArray = this.associated[associationEntityType];
				if(Common.Utilities.isNotNullOrUndefined(associatedEntityArray) &&
					associatedEntityArray.length > 0) {
					for(let i = 0; i < associatedEntityArray.length; i++) {
						let associatedEntity = associatedEntityArray[i];

						if(Common.Utilities.isNotNullOrUndefined(associatedEntity))
							associations.push(associatedEntity);
					}	
				}
			}
			return associations;
		}

	}

}